import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <Flex
      height="100vh"
      overflow="hidden"
      bg="radial-gradient(circle at center, #FFCF50 0%, #FFD966 100%)"
    >
      {/* Left side with logo and rainbow */}
      <Flex
        w="50%"
        align="center"
        justify="center"
        direction="column"
        position="relative"
        p={8}
      >
        {/* Slipstream top-left corner */}
        <Text
          position="absolute"
          top="20px"
          left="20px"
          fontSize="80"
          fontWeight="extrabold"
          color="white"
          fontFamily="'Montserrat', sans-serif"
          textShadow="1px 1px 4px rgb(0, 0, 0)"
        >
          SLIPSTREAM
        </Text>

        {/* Logo */}
        <Image
          src="/bloomfieldlogo.png"
          alt="Bloomfields Logo"
          w="40%"
          h="40%"
          objectFit="cover"
          mb={6}
          zIndex={2}
        />

        {/* Rainbow background */}
        <Image
          src="/rainbow.png"
          alt="Rainbow"
          position="absolute"
          bottom="0"
          left="0"
          width="100%"
          height="100%"
          zIndex={1}
        />
      </Flex>

      {/* Right side login form */}
      <Flex
        w="50%"
        bg="#F9FDE9"
        align="center"
        justify="center"
        p={8}
        borderTopLeftRadius="3xl"
        borderBottomLeftRadius="3xl"
      >
        <Box
          bg="#FFFCE9"
          p={8}
          borderRadius="2xl"
          boxShadow="md"
          border="1px solid #9AA69B"
          w="100%"
          maxW="sm"
        >
          <Heading size="lg" mb={6} fontWeight="bold">
            Login
          </Heading>

          <Stack spacing={4}>
            <Input placeholder="email" bg="white" />
            <Input placeholder="password" type="password" bg="white" />
            <Button
              bgGradient="linear(to-r, #1E90FF, #007FFF)"
              color="white"
              fontWeight="bold"
              _hover={{ opacity: 0.9 }}
              mt={2}
            >
              LOGIN
            </Button>
          </Stack>

          <Divider my={6} />

          <Button
            leftIcon={<FcGoogle />}
            variant="outline"
            bg="white"
            borderRadius="xl"
            w="100%"
          >
            Login with Google
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;
