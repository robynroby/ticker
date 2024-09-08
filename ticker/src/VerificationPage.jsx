import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack } from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const BACKEND_VERIFIER_API_URL = "http://localhost:8000";
const VERIFIER_BACKEND_API_URL_FOR_SIGNIN = `${BACKEND_VERIFIER_API_URL}/api/signIn`;
const VERIFIER_BACKEND_API_URL_FOR_STATUS = `${BACKEND_VERIFIER_API_URL}/api/status`;

const VerificationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [verificationQuery, setVerificationQuery] = useState("");
    const [loading, setLoading] = useState(false);
    let intervalId;
    let timeoutId;

    useEffect(() => {
        const queryType = new URLSearchParams(location.search).get('queryType');
        if (queryType === "SignIn") {
            console.log("Sign In is Fetching", VERIFIER_BACKEND_API_URL_FOR_SIGNIN);
            fetchData(VERIFIER_BACKEND_API_URL_FOR_SIGNIN);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, [location.search]);

    useEffect(() => {
        if (!loading && verificationQuery) {
            timeoutId = setTimeout(() => {
                navigate("/home");
            }, 40000); // 40 seconds
        }
        return () => clearTimeout(timeoutId);
    }, [loading, verificationQuery]);

    const fetchData = async (url) => {
        console.log(`Fetching data from ${url}`);
        setLoading(true);
        try {
            const response = await axios.get(url);
            const contentType = response.headers['content-type'];
            console.log(response.data);

            if (contentType && contentType.includes("application/json")) {
                const data = response.data;

                setVerificationQuery(JSON.stringify(data));
                console.log(`callbackUrl: ${data.body.callbackUrl}`);
                const urlObj = new URL(data.body.callbackUrl);
                const sessionId = urlObj.searchParams.get("sessionId");
                console.log(`sessionId: ${sessionId}`);
                listenForResponse(sessionId);
            } else {
                console.error("Error: Expected JSON response");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const listenForResponse = async (sessionId) => {
        console.log("Listening for response... SessionId: ", sessionId);
        if (!sessionId) {
            console.error("Error: sessionId is missing");
            return;
        }

        const interval = 5 * 1000; // 5 seconds
        intervalId = setInterval(() => {
            checkAuthStatus(sessionId);
        }, interval);
    };

    const checkAuthStatus = async (sessionId) => {
        try {
            const response = await axios.get(VERIFIER_BACKEND_API_URL_FOR_STATUS, {
                params: {
                    sessionId: sessionId,
                },
            });

            const data = response.data;
            console.log(data);
            if (data.body?.message) {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                console.log(`Message: ${data.body.message}`);

                localStorage.setItem("isLogin", "true");
                navigate("/");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (loading || !verificationQuery) {
        return (
            <VStack h='100vh' align='center' justify='center'>
                Loading...
            </VStack>
        );
    }

    return (
        <VStack h='100vh' mt={200} align='center' spacing={8}>
            <Heading>{new URLSearchParams(location.search).get('queryType')}</Heading>
            <Box h='300px' w='300px' bg='gray.200'>
                <QRCode value={verificationQuery} size={300} />
            </Box>
        </VStack>
    );
};

export default VerificationPage;
