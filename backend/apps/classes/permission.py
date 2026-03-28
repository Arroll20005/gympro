from rest_framework.permissions import BasePermission   

class IsAdminOrTrainer(BasePermission):
    def has_permission(self,request, view):
        print(f"DEBUG PERMISSION: User: {request.user}, Authenticated: {request.user.is_authenticated}")
        if request.user.is_authenticated:
            print(f"DEBUG PERMISSION: User role: {getattr(request.user, 'role', 'NO ROLE')}")
            print(f"DEBUG PERMISSION: User is_staff: {request.user.is_staff}")

        user= request.user
        if not user.is_authenticated:
            print("DEBUG PERMISSION: User not authenticated")
            return False
        result = user.is_staff or user.role == 'ENTRENADOR'
        print(f"DEBUG PERMISSION: Returning {result}")
        return result