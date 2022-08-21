import PolicyPage from '@/components/PolicyPage'

const Privacy = () => {
  return (
    <PolicyPage
      title="개인정보 처리방침"
      content={
        <>
          <iframe src="https://docs.google.com/document/d/e/2PACX-1vQcqgmUf6LEM2Jn6yrteh5LgeHJXLj4qViP9vwKTZFKnkb0hCsaYjprpEpb2ypzRjMHokvPHnbOpdDB/pub?embedded=true"></iframe>
            <iframe src="https://docs.google.com/document/d/e/2PACX-1vS_bvPxpF35OPQwAJwg26rcvwsem_D32k0zMpUrikflimuER2jDOswaLTYAEZ5JaG1jgJQdVYvLv3SN/pub?embedded=true"></iframe>
        </>
      }
    />
  )
}

export default Privacy