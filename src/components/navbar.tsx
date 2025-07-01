import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [dateTime, setDateTime] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const formattedTime = now.toLocaleTimeString(undefined, {
      hour12: false,
    });

    setDateTime({ date: formattedDate, time: formattedTime });
  }, []);

  return (
    <Box boxShadow="md">
      {/* MAIN NAVBAR */}
      <Box
        bg={`radial-gradient(circle at center, #FFCF50A6 0%, #FFCF50 65%)`}
        h="140px"
        px={6}
      >
        <Flex align="center" h="100%">
          <Flex align="center" gap={4}>
            <Image
              src="/bloomfieldlogo.png"
              alt="Bloomfield Logo"
              height="120px"
              objectFit="contain"
            />
            <Text
              fontFamily="'Montserrat', sans-serif"
              fontSize="60"
              fontWeight="800"
              color="#626F47"
            >
              SLIPSTREAM
            </Text>
          </Flex>

          <Spacer />

          <Button
            onClick={() => router.push("/logout")}
            bg="#FEFAE0"
            color="#626F47"
            height="50px"
            width="100px"
            fontWeight="bold"
            _hover={{ bg: "#626F47", color: "#FEFAE0" }}
          >
            Logout
          </Button>
        </Flex>
      </Box>

      {/* BOTTOM UTILITY BAR */}
      <Box
        bg="#8B6A16"
        color="#FFD566"
        py={1}
        px={6}
        fontFamily="'Inter', sans-serif"
      >
        <Flex justify="space-between" align="center">
          {/* Left: Date and Time */}
          {dateTime && (
            <Text fontSize="sm">
              {dateTime.date} &nbsp;&nbsp; {dateTime.time}
            </Text>
          )}

          {/* Right: Navigation Buttons */}
          <Flex gap={4} fontSize="sm">
            <Text cursor="pointer" _hover={{ textDecoration: "underline" }}>
              Earning
            </Text>
            <Text>||</Text>
            <Text cursor="pointer" _hover={{ textDecoration: "underline" }}>
              Deductions
            </Text>
            <Text>||</Text>
            <Text cursor="pointer" _hover={{ textDecoration: "underline" }}>
              Payslip form
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Navbar;
