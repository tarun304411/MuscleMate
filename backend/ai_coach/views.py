import json
import os
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
import google.generativeai as genai

# Configure Gemini API - Fixed configuration
api_key = None
try:
    # Get API key from Django settings
    api_key = getattr(settings, 'GOOGLE_API_KEY', None)
    
    if api_key:
        print(f"✅ Gemini API Key loaded: {api_key[:10]}...")
        genai.configure(api_key=api_key)
    else:
        print(" No Gemini API Key found in Django settings")
        
except Exception as e:
    print(f" Gemini API configuration error: {e}")
    api_key = None

@csrf_exempt
@require_http_methods(["POST"])
def ai_coach_chat(request):
    """
    AI Fitness Coach chat endpoint
    """
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return JsonResponse({
                'success': False,
                'error': 'Message is required'
            }, status=400)
        
        # Check if Gemini is configured
        if not api_key:
            return JsonResponse({
                'success': False,
                'error': 'AI service not configured. Please add GOOGLE_API_KEY to environment variables.'
            }, status=500)
        
        try:
            # Create Gemini model instance
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Create fitness coach prompt
            prompt = f"""You are 'MuscleMate Coach', an AI Fitness Coach. 

User message: {user_message}

Respond as a helpful, motivating fitness coach. Provide:
- Personalized advice based on the message
- Actionable fitness tips
- Motivational encouragement
- Keep responses friendly and under 100 words

If the user writes in Hindi, respond in Hindi. If in English, respond in English.
If mixed language (Hinglish), respond in Hinglish.

Be encouraging, knowledgeable, and helpful. Focus on fitness, nutrition, workouts, and motivation."""

            # Generate response
            response = model.generate_content(prompt)
            
            return JsonResponse({
                'success': True,
                'response': response.text,
                'timestamp': datetime.now().isoformat(),
                'model': 'gemini-1.5-flash'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'AI response generation failed: {str(e)}'
            }, status=500)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def ai_coach_status(request):
    """
    Check AI Coach service status
    """
    try:
        if api_key:
            return JsonResponse({
                'success': True,
                'status': 'active',
                'model': 'gemini-1.5-flash',
                'message': 'AI Fitness Coach is ready!'
            })
        else:
            return JsonResponse({
                'success': False,
                'status': 'inactive',
                'message': 'AI service not configured. Please add GOOGLE_API_KEY to environment variables.'
            })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'status': 'error',
            'message': f'Service error: {str(e)}'
        })

@require_http_methods(["GET"])
def test_connection(request):
    """
    Simple test endpoint to verify connection
    """
    return JsonResponse({
        'success': True,
        'message': 'Connection successful! AI Coach is working! 🎉',
        'timestamp': datetime.now().isoformat(),
        'api_key_status': 'configured' if api_key else 'not_configured',
        'api_key_preview': api_key[:10] + '...' if api_key else 'none'
    })

@csrf_exempt
@require_http_methods(["POST"])
def ai_workout_plan(request):
    """
    Generate personalized workout plan
    """
    try:
        data = json.loads(request.body)
        user_goal = data.get('goal', 'general_fitness')
        user_time = data.get('time', '30')
        user_level = data.get('level', 'beginner')
        
        if not api_key:
            return JsonResponse({
                'success': False,
                'error': 'AI service not configured'
            }, status=500)
        
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            prompt = f"""Create a personalized workout plan for:
Goal: {user_goal}
Available time: {user_time} minutes
Fitness level: {user_level}

Provide:
1. Warm-up exercises (5 minutes)
2. Main workout (20-25 minutes)
3. Cool-down (5 minutes)
4. Tips for proper form
5. Modifications for different levels

Keep it practical and actionable. Format as a structured plan."""

            response = model.generate_content(prompt)
            
            return JsonResponse({
                'success': True,
                'workout_plan': response.text,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Workout plan generation failed: {str(e)}'
            }, status=500)
            
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def ai_nutrition_advice(request):
    """
    Generate personalized nutrition advice
    """
    try:
        data = json.loads(request.body)
        user_goal = data.get('goal', 'general_health')
        dietary_pref = data.get('dietary_preference', 'vegetarian')
        user_time = data.get('meal_time', 'breakfast')
        
        if not api_key:
            return JsonResponse({
                'success': False,
                'error': 'AI service not configured'
            }, status=500)
        
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            prompt = f"""Provide personalized nutrition advice for:
Goal: {user_goal}
Dietary preference: {dietary_pref}
Meal time: {user_time}

Include:
1. Meal suggestions
2. Nutritional benefits
3. Portion guidance
4. Timing tips
5. Healthy alternatives

Focus on Indian food options. Keep it practical and actionable."""

            response = model.generate_content(prompt)
            
            return JsonResponse({
                'success': True,
                'nutrition_advice': response.text,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Nutrition advice generation failed: {str(e)}'
            }, status=500)
            
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=500)
