import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { FC, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
  CollectionFilter,
  StringFilter,
  useSearchCollectionQuery,
} from '../../../graphql'
import { Filter } from '../../../hooks/useAssetFilterFromQuery'
import CollectionListItem from '../../Collection/ListItem'
import List, { ListItem } from '../../List/List'
import SearchInput from '../../SearchInput'

type Props = {
  formValues: UseFormReturn<Filter, any, undefined>
  selectedCollection?: {
    chainId: number
    address: string
    name: string
    image: string | null
    floorPrice: {
      valueInRef: string
      refCode: string
    } | null
    totalVolume: {
      valueInRef: string
      refCode: string
    }
  }
  onCollectionChange: (data?: { chainId: number; address: string }) => void
  onFilterChange: (data?: Partial<Filter>) => void
}

const FilterByCollection: FC<Props> = ({
  formValues: { setValue, watch },
  selectedCollection,
  onCollectionChange,
  onFilterChange,
}) => {
  const { t } = useTranslation('components')

  const filterResult = watch()

  const { data: collectionData } = useSearchCollectionQuery({
    variables: {
      limit: 8,
      offset: 0,
      filter: {
        name: {
          includesInsensitive: filterResult.collectionSearch || '',
        } as StringFilter,
        ...(filterResult.chains.length
          ? { chainId: { in: filterResult.chains } }
          : {}),
      } as CollectionFilter,
    },
    skip: !!selectedCollection,
    ssr: false,
  })
  const collections = collectionData?.collections?.nodes

  const collection = useMemo(() => {
    if (selectedCollection) return selectedCollection
    if (!filterResult.collection) {
      onCollectionChange(undefined)
      return
    }
    const [chainId, address] = filterResult.collection.split('-')
    if (!chainId || !address) return
    const collection = collections?.find(
      (x) => x.address === address && x.chainId === parseInt(chainId, 10),
    )
    onCollectionChange(
      collection ? { chainId: collection.chainId, address } : undefined,
    )
    return collection
  }, [
    collections,
    filterResult.collection,
    selectedCollection,
    onCollectionChange,
  ])

  return collection ? (
    <AccordionItem>
      <AccordionButton>
        <Heading variant="heading2" flex="1" textAlign="left">
          {selectedCollection
            ? t('filters.assets.properties.label')
            : t('filters.assets.properties.labelWithCollection')}
        </Heading>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Stack spacing={3}>
          {!selectedCollection && (
            <CollectionListItem
              width="full"
              borderColor="brand.500"
              bgColor="brand.50"
              borderWidth="1px"
              borderRadius="md"
              padding={2}
              textAlign="left"
              cursor="pointer"
              onClick={() => onFilterChange({ collection: null, traits: [] })}
              collection={collection}
              closable
            />
          )}
          <SearchInput
            placeholder={t('filters.assets.properties.search.placeholder')}
            name="propertySearch"
            onReset={() => setValue('propertySearch', '')}
          />
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  ) : (
    <AccordionItem>
      <AccordionButton>
        <Heading variant="heading2" flex="1" textAlign="left">
          {t('filters.assets.collections.label')}
        </Heading>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Stack spacing={4}>
          <SearchInput
            placeholder={t('filters.assets.collections.search.placeholder')}
            name="collectionSearch"
            onReset={() => setValue('collectionSearch', '')}
          />
          <List>
            {!collections ? (
              new Array(8)
                .fill(0)
                .map((_, index) => (
                  <ListItem
                    key={index}
                    image={<SkeletonCircle size="8" borderRadius="sm" />}
                    imageSize={8}
                    imageRounded="sm"
                    label={<SkeletonText noOfLines={2} width="24" />}
                    action={<SkeletonText noOfLines={2} width="24" />}
                  />
                ))
            ) : collections.length > 0 ? (
              collections.map((collection) => (
                <CollectionListItem
                  key={`${collection.chainId}-${collection.address}`}
                  cursor={'pointer'}
                  rounded="xl"
                  transition={'background-color 0.3s ease-in-out'}
                  _hover={{
                    bgColor: 'brand.50',
                  }}
                  onClick={() =>
                    onFilterChange({
                      collection: `${collection.chainId}-${collection.address}`,
                      traits: [],
                    })
                  }
                  collection={collection}
                />
              ))
            ) : (
              <VStack spacing={1}>
                <Text variant="subtitle2" color="gray.800" as="span">
                  {t('filters.collections.empty.title')}
                </Text>
                <Text variant="caption" as="span">
                  {t('filters.collections.empty.description')}
                </Text>
              </VStack>
            )}
          </List>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  )
}

export default FilterByCollection
