import abc

class ControlSensorI:
    @abc.abstractmethod
    def set(self):
        pass

    @abc.abstractmethod
    def setup(self):
        pass

    @abc.abstractmethod
    def destroy(self):
        pass
