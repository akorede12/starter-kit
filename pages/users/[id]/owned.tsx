import { useSigner } from '@nft/hooks'
import { UserOwnedAssets } from '@nft/templates'
import { NextPage } from 'next'
import Head from '../../../components/Head'
import environment from '../../../environment'
import useEagerConnect from '../../../hooks/useEagerConnect'
import LargeLayout from '../../../layouts/large'

export const getServerSideProps = UserOwnedAssets.server(
  environment.GRAPHQL_URL,
  environment.PAGINATION_LIMIT,
)

const OwnedPage: NextPage<UserOwnedAssets.Props> = ({
  meta,
  now,
  limit,
  page,
  offset,
  orderBy,
  userAddress,
}) => {
  const ready = useEagerConnect()
  const signer = useSigner()
  return (
    <LargeLayout>
      <Head
        title={meta.title}
        description={meta.description}
        image={meta.image}
      />
      <UserOwnedAssets.Template
        limit={limit}
        limits={[environment.PAGINATION_LIMIT, 24, 36, 48]}
        now={now}
        offset={offset}
        orderBy={orderBy}
        page={page}
        userAddress={userAddress}
        loginUrlForReferral={environment.BASE_URL + '/login'}
        ready={ready}
        signer={signer}
      />
    </LargeLayout>
  )
}

export default OwnedPage