from rest_framework import permissions


class IsOwner(permissions.IsAuthenticated):
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


class IsAuthenticatedOrCreateOnly(permissions.IsAuthenticated):

    def has_permission(self, request, view):
        if view.action == 'create':
            return True
        return super().has_permission(request, view)
