import PolicyPage from '@/components/PolicyPage'

const Policy = () => {
  return (
    <PolicyPage
      title="이용약관"
      content={
        <>
          <iframe src="https://docs.google.com/document/d/e/2PACX-1vRawuaB0KQiXjjSGfegcW4VcabFmNu8ieGQ8EErU6CeEbs1TDi0dTgYvKoHXjYNN9vwpBu3W-N8Sn44/pub?embedded=true"></iframe>
        </>
      }
    />
  )
}

export default Policy