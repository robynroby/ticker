import { VStack, Heading, Button, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const goToVerifyTicket = () => {
        navigate('/verify-ticket');
    };

    const goToBuyTicket = () => {
        navigate('/buy-ticket');
    };

    return (
        <VStack spacing={8} h="100vh" align="center" justify="center">
            <Heading>Welcome to Train Ticketing</Heading>
            <Box>
                <Button
                    onClick={goToVerifyTicket}
                    colorScheme="blue"
                    size="lg"
                    m={4}
                >
                    Verify Ticket
                </Button>
                <Button
                    onClick={goToBuyTicket}
                    colorScheme="green"
                    size="lg"
                    m={4}
                >
                    Buy Ticket
                </Button>
            </Box>
        </VStack>
    );
}
