from django.shortcuts import render
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from userauth.models import User, Profile
from userauth.serializers import MyTokenObtainPairSerializer, ProfileSerializer, RegisterSerializer, UserSerializer

import shortuuid
import hashlib

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = RegisterSerializer

def generate_otp():
    uuid_key = shortuuid.uuid()
    otp = uuid_key[:6]
    return otp

class PasswordResetEmailVerifyView(generics.RetrieveAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserSerializer

    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.get(email=email)

        print("user = ", user)

        if user:
            user.otp = generate_otp()
            user.otp = hashlib.sha256(user.otp.encode()).hexdigest()
            user.save()


            uidb64 = user.pk
            otp = user.otp

            base_url = settings.BASE_URL
            link = f"{base_url}/create-new-password?otp={otp}&uidb64={uidb64}"

            context = {
                'link': link,
                'username': user.username
            }

            msg = EmailMultiAlternatives(
                subject="EXCLSV",
                from_email=settings.EMAIL_HOST_USER,
                to=[email],
                body=""
            )
            msg.attach_alternative(render_to_string('email/password_reset.html', context), "text/html")
            msg.send()

        
        return user

class PasswordChangeView(generics.CreateAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserSerializer
    
    def create(self, request, *args, **kwargs):
        payload = request.data
        otp = payload['otp']
        uidb64 = payload['uidb64']
        password = payload['password']

        user = User.objects.get(otp=otp, id=uidb64)
        if user:
            user.set_password(password)
            user.otp = ""
            user.save()
            
            return Response({"message": "Password changed successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "An error occured!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        return profile

