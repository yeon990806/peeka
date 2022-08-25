import PolicyPage from '@/components/PolicyPage'

const Privacy = () => {
  return (
    <PolicyPage
      title="개인정보처리방침"
      content={
        <>
          <iframe src="https://docs.google.com/document/d/e/2PACX-1vQcqgmUf6LEM2Jn6yrteh5LgeHJXLj4qViP9vwKTZFKnkb0hCsaYjprpEpb2ypzRjMHokvPHnbOpdDB/pub?embedded=true"></iframe>
        </>
      }
    />
  )
}

export default Privacy