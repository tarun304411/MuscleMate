from django.urls import path
from . import views

app_name = 'ai_coach'

urlpatterns = [
    # Main AI Coach chat endpoint
    path('chat/', views.ai_coach_chat, name='ai_coach_chat'),
    
    # Service status check
    path('status/', views.ai_coach_status, name='ai_coach_status'),
    
    # Test connection endpoint
    path('test/', views.test_connection, name='test_connection'),
    
    # Workout plan generation
    path('workout-plan/', views.ai_workout_plan, name='ai_workout_plan'),
    
    # Nutrition advice generation
    path('nutrition-advice/', views.ai_nutrition_advice, name='ai_nutrition_advice'),
]
