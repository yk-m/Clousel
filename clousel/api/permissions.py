from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `owner`.
        if not request.user.is_authenticated():
            return False

        if view.action == 'create':
            return True

        return obj.owner == request.user


class IsAdminOrIsSelf(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, user):
        if request.user.is_superuser:
            return True

        return request.user.id == user.id
