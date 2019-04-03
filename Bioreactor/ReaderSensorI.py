import abc

class SensorControlInterface:
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def setup(self):
        pass
    
    @abc.abstractmethod
    def destroy(self):
        pass

    @abc.abstractmethod
    def getValue(self):
        pass

