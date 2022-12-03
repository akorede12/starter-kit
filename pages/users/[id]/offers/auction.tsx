import { useSigner } from '@nft/hooks'
import { UserAuctions } from '@nft/templates'
import { NextPage } from 'next'
import Head from '../../../../components/Head'
import environment from '../../../../environment'
import useEagerConnect from '../../../../hooks/useEagerConnect'
import LargeLayout from '../../../../layouts/large'

export const getServerSideProps = UserAuctions.server(
  environment.GRAPHQL_URL,
  environment.PAGINATION_LIMIT,
)

const AuctionPage: NextPage<UserAuctions.Props> = ({
  meta,
  now,
  limit,
  page,
  offset,
  orderBy,
  userAddress,
}) => {
  useEagerConnect()
  const signer = useSigner()
  return (
    <LargeLayout>
      <Head
        title={meta.title}
        description={meta.description}
        image={meta.image}
      />

      <UserAuctions.Template
        explorer={{
          name: environment.BLOCKCHAIN_EXPLORER_NAME,
          url: environment.BLOCKCHAIN_EXPLORER_URL,
        }}
        limit={limit}
        limits={[environment.PAGINATION_LIMIT, 24, 36, 48]}
        now={now}
        offset={offset}
        orderBy={orderBy}
        page={page}
        userAddress={userAddress}
        loginUrlForReferral={environment.BASE_URL + '/login'}
        signer={signer}
      />
    </LargeLayout>
  )
}

export default AuctionPage