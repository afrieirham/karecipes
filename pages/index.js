import { Box, Flex, Grid, Hide, Image, Input, Link, Show, Text } from '@chakra-ui/react'
import { useState } from 'react'

import { client } from '../utils/contentful'

export const getStaticProps = async () => {
  const response = await client.getEntries({ limit: 1000 })

  // Sort recipes based on createdAt
  const recipes = response.items.sort((a, b) => {
    const i = new Date(a.sys.createdAt)
    const j = new Date(b.sys.createdAt)
    return j - i
  })

  return {
    props: {
      recipes,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - Every 10 minutes
    revalidate: 60 * 10,
  }
}

export default function Home({ recipes }) {
  const [filtered, setFiltered] = useState(recipes)

  const onSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase()

    const filtered = recipes.filter((item) => {
      const currentRecipe = item.fields.title.toLowerCase()
      return currentRecipe.includes(searchTerm)
    })

    setFiltered(filtered)
  }

  const renderItems = () =>
    filtered.map(({ fields }) => {
      const hasImage = Boolean(fields.thumbnail?.fields.file.url)
      return (
        <Flex
          as={Link}
          href={fields.postUrl}
          isExternal
          _hover={{ textDecoration: 'none' }}
          key={fields.postUrl}
          boxShadow='md'
          borderRadius='md'
          bg='white'
          w={{ base: 'sm', md: 'full' }}
          mx='auto'
          my={{ base: '2', md: '0' }}
        >
          <Image
            maxW='120px'
            maxH='120px'
            minW='120px'
            minH='120px'
            src={hasImage ? fields.thumbnail.fields.file.url : '/recipe-placeholder.png'}
            borderLeftRadius='md'
            fit='cover'
            boxShadow='md'
          />
          <Flex py='2' px='4' minH='full'>
            <Text fontWeight='semibold' fontSize='md' noOfLines={4}>
              {fields.title}
            </Text>
          </Flex>
        </Flex>
      )
    })

  const displayProps = {
    h: '80vh',
    w: 'full',
    mx: { base: 'auto', lg: 0 },
    overflow: 'scroll',
    px: { base: '0', md: '6', lg: '8' },
    py: '2',
  }

  return (
    <Box bgColor='#EDF2F7'>
      <Flex
        direction='column'
        h='15vh'
        mx='auto'
        w='full'
        maxW='sm'
        justifyContent='center'
        alignItems='center'
      >
        <Text fontSize='xl' fontWeight='bold' textAlign='center' mb='2'>
          Koleksi Resepi Khairulaming
        </Text>
        <Input placeholder='Cari resepi...' size='lg' bg='white' onChange={onSearch} />
      </Flex>

      <Flex display={{ base: 'flex', md: 'none' }} direction='column' {...displayProps}>
        {renderItems()}
      </Flex>

      <Grid
        display={{ base: 'none', md: 'grid' }}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
        templateRows='repeat(10, 1fr)'
        gap='6'
        {...displayProps}
      >
        {renderItems()}
      </Grid>

      <Flex py='4' justifyContent='center' alignItems='center' h='5vh'>
        <Text color='gray.500' fontSize='xs' textAlign='center'>
          <Link href='https://afrieirham.com' isExternal>
            Made with ❤️ by Afrie
          </Link>
        </Text>
      </Flex>
    </Box>
  )
}

