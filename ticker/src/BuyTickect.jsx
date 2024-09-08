import { VStack, Heading, Input, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';

export default function BuyTicket() {
    const [ticketDetails, setTicketDetails] = useState({ destination: '', amount: '' });
    const [phoneNumber, setPhoneNumber] = useState('');
    const toast = useToast();

    const validatePhoneNumber = (phoneNumber) => {
        // Simple validation for Kenyan phone numbers
        const phoneRegex = /^(\+254|0)\d{9}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleBuyTicket = async () => {
        if (!ticketDetails.destination || !ticketDetails.amount || !phoneNumber) {
            toast({
                title: 'Error',
                description: 'Please fill in all fields.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!validatePhoneNumber(phoneNumber)) {
            toast({
                title: 'Error',
                description: 'Please enter a valid phone number.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await axios.post('/api/mpesa', {
                destination: ticketDetails.destination,
                amount: ticketDetails.amount,
                phoneNumber: phoneNumber,
            });
            if (response.data.success) {
                toast({
                    title: 'Payment Successful',
                    description: 'Ticket purchased successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Payment Failed',
                    description: 'Failed to complete the payment.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An error occurred during the payment process.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <VStack h="100vh" align="center" justify="center" spacing={4}>
            <Heading>Buy Train Ticket</Heading>
            <Input
                placeholder="Destination"
                size="lg"
                value={ticketDetails.destination}
                onChange={(e) => setTicketDetails({ ...ticketDetails, destination: e.target.value })}
                w="300px"
                mb={4}
            />
            <Input
                placeholder="Amount (KES)"
                size="lg"
                type="number"
                value={ticketDetails.amount}
                onChange={(e) => setTicketDetails({ ...ticketDetails, amount: e.target.value })}
                w="300px"
                mb={4}
            />
            <Input
                placeholder="Phone Number"
                size="lg"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                w="300px"
                mb={4}
            />
            <Button colorScheme="green" size="lg" onClick={handleBuyTicket}>
                Buy Ticket
            </Button>
        </VStack>
    );
}
