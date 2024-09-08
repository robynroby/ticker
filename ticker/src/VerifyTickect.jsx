import { VStack, Heading, Input, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';

export default function VerifyTicket() {
    const [ticketId, setTicketId] = useState('');
    const toast = useToast();

    const handleVerify = async () => {
        if (!ticketId) {
            toast({
                title: 'Error',
                description: 'Please enter a ticket ID.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await axios.post('/api/verify-ticket', { ticketId });
            if (response.data.valid) {
                toast({
                    title: 'Success',
                    description: 'Ticket verified successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Invalid Ticket',
                    description: 'The ticket ID you entered is invalid.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An error occurred while verifying the ticket.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <VStack h="100vh" align="center" justify="center" spacing={4}>
            <Heading>Verify Your Ticket</Heading>
            <Input
                placeholder="Enter Ticket ID"
                size="lg"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                w="300px"
                mb={4} // Added margin-bottom for spacing
            />
            <Button colorScheme="blue" size="lg" onClick={handleVerify}>
                Verify Ticket
            </Button>
        </VStack>
    );
}
