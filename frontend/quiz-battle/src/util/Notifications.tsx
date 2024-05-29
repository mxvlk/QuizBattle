import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

function errorNotification(message: string) {
    notifications.show({
        title: 'Error',
        message: message,
        color: 'red',
        icon: <IconX />,
        withBorder: true
      });
}

function serverErrorNotification() {
    errorNotification('Server is not responding!');
}

function invalidCredentialsNotification() {
    errorNotification('The credentials you used are invalid!');
}

function somethingWentWrongNotification() {
    errorNotification('Something went wrong!');
}

function wrongCredentialsNotification() {
    errorNotification('Username or password is wrong!');
}

function easterEggMessage() {
    notifications.show({
        title: 'Easter Egg',
        message: 'You clicked 10 times on the logo!',
        color: 'green',
        icon: '😳'
    });
}

function connectionLostMessage() {
    notifications.show({
        title: 'Connection Error',
        message: 'Connection to server lost. You are offline!',
        color: 'red'
    });
}

export {
    serverErrorNotification,
    somethingWentWrongNotification,
    wrongCredentialsNotification,
    easterEggMessage,
    connectionLostMessage,
    invalidCredentialsNotification,
    errorNotification
};