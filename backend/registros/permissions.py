from rest_framework import permissions

class EsDirectorOSoloLectura(permissions.BasePermission): 

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True
        
        return request.user.is_superuser or request.user.groups.filter(name__iexact='director').exists()

class EsDirectorOProfesorParaEscritura(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True
        
        es_director = request.user.is_superuser or request.user.groups.filter(name__iexact='director').exists()
        es_profesor = request.user.groups.filter(name__iexact='profesor').exists()

        return es_director or es_profesor