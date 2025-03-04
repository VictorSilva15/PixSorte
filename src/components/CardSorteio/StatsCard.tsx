/* eslint-disable array-callback-return */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Stack,
  Icon,
  Stat,
  StatLabel,
  useColorModeValue,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  HStack
} from '@chakra-ui/react';
import { MdDateRange } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { SearchBox } from './SearchBox';
import { CardsProps } from './index';

import { DownloadPdf } from '../DonwloadPdf';
import { api } from '../../services/apiClient';

interface StatsCardProps {
  date: Date;
  card: CardsProps;
  setCards: (any) => void;
}

export function StatsCard(props: StatsCardProps) {
  const [cardFound, setCardFound] = useState([]);

  const [cardThatContainsSortedNumber, setCardThatContainsSortedNumber] =
    useState([]);

  useEffect(() => {
    setCardThatContainsSortedNumber(
      // eslint-disable-next-line react/destructuring-assignment
      props.card.values_sorted.filter(singlecard =>
        // eslint-disable-next-line react/destructuring-assignment
        singlecard?.includes(props.card.sort_result)
      )
    );
  }, [cardFound]);

  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropContrast="90%"
      backdropBlur="5px"
    />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayTwo />);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { date, card } = props;
  const newDate = date
    .toString()
    .split('-')
    .reverse()
    .map((value, index) => {
      if (index === 0) {
        return `${value.split('').slice(0, 2).join('')}`;
      }
      return value;
    })
    .join('/');

  async function Delete(card_id: string) {
    api
      .delete(`cards/delete/${card_id}`)
      .then(() => {
        toast.success('Sorteio deletado!', {
          position: toast.POSITION.TOP_RIGHT,
          theme: 'colored'
        });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      })
      .catch(error => {
        toast.error(error, {
          position: toast.POSITION.TOP_RIGHT,
          theme: 'colored'
        });
      });
  }

  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py="5"
      shadow="xl"
      border="1px solid"
      borderColor={useColorModeValue('green.800', 'green.500')}
      rounded="lg"
    >
      <Stack spacing="4">
        <StatLabel fontWeight="medium" isTruncated color="white">
          <Text fontSize="5xl" align="center">
            <Icon as={MdDateRange} fontSize="4xl" /> {newDate}
          </Text>
        </StatLabel>
        <StatLabel fontWeight="medium" isTruncated>
          <Text fontSize="xl" color="yellow.400">
            {card.title}
          </Text>
        </StatLabel>
        <StatLabel fontWeight="medium" isTruncated color="white">
          <Text fontSize="2xl">Premio: {card.status || 'Pendente'}</Text>
        </StatLabel>

        <StatLabel>
          <Text
            fontSize="2xl"
            color="white"
            background="green"
            padding={1}
            textAlign="center"
            borderRadius="md"
            margin={0.5}
          >
            <DownloadPdf card={card} />
          </Text>
        </StatLabel>
      </Stack>
      <Flex>
        <>
          <Button
            mt="4"
            w="100%"
            colorScheme="yellow"
            variant="solid"
            onClick={() => {
              setOverlay(<OverlayTwo />);
              onOpen();
            }}
          >
            Saiba Mais
          </Button>

          <Modal isCentered isOpen={isOpen} onClose={onClose} size="3xl">
            {overlay}
            <ModalContent bg="green.900">
              <ModalHeader color="white" fontSize="4xl" textAlign="center">
                Sorteio: {newDate}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex mb="4" justify="space-between">
                  <SearchBox
                    values={card.values_sorted}
                    setCardFound={setCardFound}
                    card_id={card.card_id}
                    // eslint-disable-next-line react/destructuring-assignment
                    setCards={props.setCards}
                    // eslint-disable-next-line react/destructuring-assignment
                    status={props.card.status}
                  />
                  <Text
                    color="white"
                    fontSize="xl"
                    fontWeight="bold"
                    py="5"
                    px="5"
                    shadow="xl"
                    border="1px solid"
                    borderColor={useColorModeValue('green.800', 'green.500')}
                    rounded="lg"
                  >
                    Numero Sorteado: {card.sort_result || 'Não Existe'}
                  </Text>
                </Flex>
                <Flex
                  direction="column"
                  color="white"
                  fontSize="xl"
                  fontWeight="bold"
                  py="5"
                  px="5"
                  shadow="xl"
                  border="1px solid"
                  borderColor={useColorModeValue('green.800', 'green.500')}
                  rounded="lg"
                >
                  <Stack>
                    <Text color="white" fontSize="xl" fontWeight="bold">
                      Status: {card.status}
                    </Text>
                    <Text>Numero de Cartelas: {card.number_of_cards}</Text>
                    <Text color="white" fontSize="xl" fontWeight="bold">
                      Valor R$: {card.unit_price}
                    </Text>
                    <Text color="white" fontSize="xl" fontWeight="bold">
                      Quantidade de números aleatórios por cartela:{' '}
                      {card.amount_random_number}
                    </Text>
                    <Flex>
                      <HStack>
                        <Text color="white" fontSize="xl" fontWeight="bold">
                          Min: {card.min}
                        </Text>
                        <Text color="white" fontSize="xl" fontWeight="bold">
                          Max: {card.max}
                        </Text>
                      </HStack>
                    </Flex>

                    <Text color="white" fontSize="xl" fontWeight="bold">
                      Cartela: [{' '}
                      {cardFound[0]?.map(number => `${number} `) ||
                        cardThatContainsSortedNumber[0]?.map(
                          number => `${number} `
                        ) ||
                        'Sem cartela'}
                      ]
                    </Text>
                  </Stack>
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  mr="2"
                  colorScheme="yellow"
                  variant="solid"
                  onClick={() => Delete(card.card_id)}
                >
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      </Flex>
    </Stat>
  );
}
