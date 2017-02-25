from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import logout as auth_logout
import datetime

class LoggedMixin(LoginRequiredMixin):
    login_url = '/login/'

    def dispatch(self, request, *args, **kwargs):
        print('dispatching')
        now = datetime.datetime.now()
        if hasattr(request.session, 'last_request_time'):
            seconds = (now - request.session.last_request_time).total_seconds()
            print('seconds from last request:', seconds)
            if seconds > 30:
                auth_logout(request)
            request.session.last_request_time = now
        else:
            setattr(request.session, 'last_request_time', now)
        return super().dispatch(request, *args, **kwargs)
