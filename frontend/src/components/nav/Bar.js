import React from "react";
import { Heading } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import {Flex } from "@chakra-ui/react";
import { Button } from '@chakra-ui/react'
import {Link}  from "react-router-dom"

function Bar() {
  return (
    <Flex justify='flex-end' color="#1A365D" p="3">
      <Box mr="auto" ><Heading ><Link to="/">Diary</Link></Heading></Box>
      <Box pr="5" pl="5"><Text mt="3" p="0" fontSize='2xl' pb="0"><Link to="/compose">Compose</Link></Text></Box>
      {/* <Box pr="5" pl="5"><Text fontSize='2xl'></Text></Box> */}
      <Box pr="5" pl="5" mt="2"><Button backgroundColor="" colorScheme="blue">Logout</Button></Box>
    </Flex>
  );
}

export default Bar;
