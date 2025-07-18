from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import random
import json
from datetime import datetime, timedelta
import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
import io

app = Flask(__name__)
CORS(app, origins=["*"])

class TimetableGenerator:
    def __init__(self, config):
        self.config = config
        self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][:config['working_days']]
        self.periods = list(range(1, config['periods_per_day'] + 1))
        self.sections = config['sections']
        self.teachers = config['teachers']
        self.teacher_subjects = config['teacher_subjects']
        self.lab_days = ['Tuesday', 'Thursday', 'Friday']
        
    def generate_time_slots(self):
        """Generate time slots based on college hours and period duration"""
        start_time = datetime.strptime(self.config['start_time'], '%H:%M')
        end_time = datetime.strptime(self.config['end_time'], '%H:%M')
        period_duration = self.config['period_duration']
        
        time_slots = []
        current_time = start_time
        
        for period in range(self.config['periods_per_day']):
            period_end = current_time + timedelta(minutes=period_duration)
            time_slots.append(f"{current_time.strftime('%H:%M')}-{period_end.strftime('%H:%M')}")
            current_time = period_end + timedelta(minutes=10)  # 10 min break
            
        return time_slots
    
    def is_valid_assignment(self, teacher, day, period, teacher_schedule, section_schedule):
        """Check if teacher assignment is valid"""
        # Check if teacher is already assigned at this time
        if teacher_schedule.get(teacher, {}).get(day, {}).get(period):
            return False
            
        # Check for back-to-back periods (add gaps where possible)
        if period > 1:
            prev_period = teacher_schedule.get(teacher, {}).get(day, {}).get(period - 1)
            if prev_period and random.random() < 0.3:  # 30% chance to add gap
                return False
                
        return True
    
    def assign_labs(self, timetables, teacher_schedule):
        """Assign 3-hour lab blocks on specific days"""
        for section in self.sections:
            section_name = section['name']
            lab_subjects = [subj for subj in section['subjects'] if 'lab' in subj.lower()]
            
            for lab_subject in lab_subjects:
                # Find teacher for this lab
                lab_teacher = None
                for teacher, subjects in self.teacher_subjects.items():
                    if lab_subject in subjects:
                        lab_teacher = teacher
                        break
                
                if not lab_teacher:
                    continue
                    
                # Assign lab on one of the lab days
                lab_day = random.choice([day for day in self.lab_days if day in self.days])
                
                # Find 3 consecutive periods for lab
                for start_period in range(1, len(self.periods) - 1):
                    periods_available = True
                    lab_periods = [start_period, start_period + 1, start_period + 2]
                    
                    # Check if teacher and section are free for all 3 periods
                    for period in lab_periods:
                        if (teacher_schedule.get(lab_teacher, {}).get(lab_day, {}).get(period) or
                            timetables[section_name].get(lab_day, {}).get(period)):
                            periods_available = False
                            break
                    
                    if periods_available:
                        # Assign lab for all 3 periods
                        for period in lab_periods:
                            if lab_day not in timetables[section_name]:
                                timetables[section_name][lab_day] = {}
                            if lab_teacher not in teacher_schedule:
                                teacher_schedule[lab_teacher] = {}
                            if lab_day not in teacher_schedule[lab_teacher]:
                                teacher_schedule[lab_teacher][lab_day] = {}
                                
                            timetables[section_name][lab_day][period] = {
                                'subject': lab_subject,
                                'teacher': lab_teacher,
                                'type': 'lab'
                            }
                            teacher_schedule[lab_teacher][lab_day][period] = {
                                'subject': lab_subject,
                                'section': section_name,
                                'type': 'lab'
                            }
                        break
    
    def assign_special_periods(self, timetables, teacher_schedule):
        """Assign sports, library, and counseling to last periods"""
        special_subjects = ['Sports', 'Library', 'Counseling']
        last_period = max(self.periods)
        
        for section in self.sections:
            section_name = section['name']
            for day in self.days:
                if random.random() < 0.4:  # 40% chance for special period
                    special_subject = random.choice(special_subjects)
                    
                    if day not in timetables[section_name]:
                        timetables[section_name][day] = {}
                        
                    timetables[section_name][day][last_period] = {
                        'subject': special_subject,
                        'teacher': 'Sports/Library Staff',
                        'type': 'special'
                    }
    
    def generate_timetable(self):
        """Generate complete timetable"""
        timetables = {section['name']: {} for section in self.sections}
        teacher_schedule = {}
        
        # First assign labs
        self.assign_labs(timetables, teacher_schedule)
        
        # Then assign regular subjects
        for section in self.sections:
            section_name = section['name']
            regular_subjects = [subj for subj in section['subjects'] if 'lab' not in subj.lower()]
            
            for day in self.days:
                if day not in timetables[section_name]:
                    timetables[section_name][day] = {}
                    
                daily_subjects = []
                
                for period in self.periods:
                    # Skip if already assigned (lab or special)
                    if period in timetables[section_name][day]:
                        continue
                    
                    # Find available subject and teacher
                    available_subjects = [subj for subj in regular_subjects 
                                        if subj not in daily_subjects]
                    
                    if not available_subjects:
                        available_subjects = regular_subjects
                    
                    subject = random.choice(available_subjects)
                    daily_subjects.append(subject)
                    
                    # Find teacher for this subject
                    available_teachers = [teacher for teacher, subjects in self.teacher_subjects.items()
                                        if subject in subjects]
                    
                    if available_teachers:
                        # Choose teacher who is free at this time
                        assigned = False
                        random.shuffle(available_teachers)
                        
                        for teacher in available_teachers:
                            if self.is_valid_assignment(teacher, day, period, teacher_schedule, timetables[section_name]):
                                timetables[section_name][day][period] = {
                                    'subject': subject,
                                    'teacher': teacher,
                                    'type': 'regular'
                                }
                                
                                if teacher not in teacher_schedule:
                                    teacher_schedule[teacher] = {}
                                if day not in teacher_schedule[teacher]:
                                    teacher_schedule[teacher][day] = {}
                                    
                                teacher_schedule[teacher][day][period] = {
                                    'subject': subject,
                                    'section': section_name,
                                    'type': 'regular'
                                }
                                assigned = True
                                break
                        
                        if not assigned:
                            # Assign any available teacher
                            teacher = random.choice(available_teachers)
                            timetables[section_name][day][period] = {
                                'subject': subject,
                                'teacher': teacher,
                                'type': 'regular'
                            }
        
        # Assign special periods last
        self.assign_special_periods(timetables, teacher_schedule)
        
        return {
            'section_timetables': timetables,
            'teacher_schedules': teacher_schedule,
            'time_slots': self.generate_time_slots()
        }

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Timetable Generator API is running'})

@app.route('/api/generate-timetable', methods=['POST'])
def generate_timetable():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['working_days', 'periods_per_day', 'teachers', 'sections', 
                          'teacher_subjects', 'period_duration', 'start_time', 'end_time']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        generator = TimetableGenerator(data)
        result = generator.generate_timetable()
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-pdf', methods=['POST'])
def download_pdf():
    try:
        data = request.json
        timetable_data = data.get('timetable_data')
        download_type = data.get('type', 'section')  # 'section' or 'teacher'
        target_name = data.get('target_name')
        
        # Create PDF
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch)
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            alignment=TA_CENTER,
            spaceAfter=20
        )
        
        story = []
        
        # Title
        if download_type == 'section':
            title = f"Section {target_name} - Timetable"
            data_source = timetable_data['section_timetables'][target_name]
        else:
            title = f"{target_name} - Teaching Schedule"
            data_source = timetable_data['teacher_schedules'][target_name]
            
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 20))
        
        # Create table data
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        periods = list(range(1, len(timetable_data['time_slots']) + 1))
        time_slots = timetable_data['time_slots']
        
        # Table headers
        table_data = [['Period'] + [f"P{p}\n{time_slots[p-1]}" for p in periods]]
        
        for day in days:
            if day in data_source:
                row = [day]
                for period in periods:
                    if period in data_source[day]:
                        cell_data = data_source[day][period]
                        if download_type == 'section':
                            cell_text = f"{cell_data['subject']}\n({cell_data['teacher']})"
                        else:
                            cell_text = f"{cell_data['subject']}\n({cell_data['section']})"
                        row.append(cell_text)
                    else:
                        row.append('Free')
                table_data.append(row)
        
        # Create table
        table = Table(table_data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        
        story.append(table)
        doc.build(story)
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'{target_name}_timetable.pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)