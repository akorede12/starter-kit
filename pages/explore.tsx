import { Explorer } from '@nft/templates'
import { NextPage } from 'next'
import Head from '../components/Head'
import environment from '../environment'
import LargeLayout from '../layouts/large'

export const getServerSideProps = Explorer.server(
  environment.GRAPHQL_URL,
  environment.PAGINATION_LIMIT,
)

const ExplorePage: NextPage<Explorer.Props> = ({
  now,
  offset,
  limit,
  queryFilter,
  filter,
  search,
  page,
  orderBy,
}) => (
  <LargeLayout>
    <Head title="Explore Collectibles" />
    <Explorer.Template
      filter={filter}
      limit={limit}
      limits={[environment.PAGINATION_LIMIT, 24, 36, 48]}
      now={now}
      offset={offset}
      orderBy={orderBy}
      page={page}
      queryFilter={queryFilter}
      search={search}
    />
  </LargeLayout>
)

export default ExplorePage
