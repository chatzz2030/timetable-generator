#!/usr/bin/env python3
"""
Test script for Timetable Generator API
"""

import json
import requests
import sys

def test_api(base_url="http://localhost:5000"):
    """Test the timetable generator API"""
    
    print("🧪 Testing Timetable Generator API")
    print("=" * 40)
    
    # Test health endpoint
    print("1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/api/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print("❌ Health check failed")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    # Load sample data
    print("\n2. Loading sample data...")
    try:
        with open('sample-data.json', 'r') as f:
            sample_data = json.load(f)
        config = sample_data['small_demo']
        print("✅ Sample data loaded")
    except Exception as e:
        print(f"❌ Error loading sample data: {e}")
        return False
    
    # Test timetable generation
    print("\n3. Testing timetable generation...")
    try:
        response = requests.post(
            f"{base_url}/api/generate-timetable",
            json=config,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("✅ Timetable generation successful")
                
                # Check response structure
                data = result['data']
                if 'section_timetables' in data and 'teacher_schedules' in data:
                    print("✅ Response structure valid")
                    
                    # Print summary
                    sections = len(data['section_timetables'])
                    teachers = len(data['teacher_schedules'])
                    periods = len(data['time_slots'])
                    
                    print(f"📊 Generated timetable:")
                    print(f"   - Sections: {sections}")
                    print(f"   - Teachers: {teachers}")
                    print(f"   - Periods: {periods}")
                    
                    return True
                else:
                    print("❌ Invalid response structure")
                    return False
            else:
                print(f"❌ Generation failed: {result.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ API call failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Generation test error: {e}")
        return False

def main():
    """Main test function"""
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        base_url = "http://localhost:5000"
    
    print(f"🔗 Testing API at: {base_url}")
    
    success = test_api(base_url)
    
    if success:
        print("\n🎉 All tests passed! API is working correctly.")
        return 0
    else:
        print("\n💥 Some tests failed. Check the API server.")
        return 1

if __name__ == "__main__":
    sys.exit(main())