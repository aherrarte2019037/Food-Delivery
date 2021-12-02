export function trackDeliverySocket(io) {
    const deliveryTrackerNamespace = io.of('/orders/delivery/tracker');

    deliveryTrackerNamespace.on('connection', (socket) => {
        console.log('USER CONNECTED TO /orders/delivery/tracker');

        socket.on('position', (data) => {
            deliveryTrackerNamespace.emit(`position/${data.order}`, { latitude: data.latitude, longitude: data.longitude });
        });

        socket.on('disconnect', (data) => {
            console.log('USER DISCONNECTED');
        });
    });
}