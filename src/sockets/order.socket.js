export function trackDeliverySocket(io) {
    const deliveryNamespace = io.of('/orders/delivery');

    deliveryNamespace.on('connection', (socket) => {
        console.log('USER CONNECTED TO /orders/delivery');

        socket.on('position', (data) => {
            deliveryNamespace.emit(`position/${data?.order}`, { latitude: data?.latitude, longitude: data?.longitude });
        });

        socket.on('disconnect', (data) => {
            console.log('USER DISCONNECTED');
        });
    });
}