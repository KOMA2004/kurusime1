import { Provider } from "../components/ui/provider"
import { render, screen } from "@testing-library/react"
import { getTracks } from "../lib/getTracks"
import App from "../App"

jest.mock("../lib/getTracks", () => ({
  getTracks: jest.fn(),
}))

const mockedGetTracks = getTracks as jest.Mock

function renderWithChakra(ui: React.ReactElement) {
  return render(<Provider>{ui}</Provider>)
}

describe("App getTracks", ()=>{
  test("楽曲取得出来たらタイトルが表示される", async () => {
    mockedGetTracks.mockResolvedValue([{
      id: "1",
        title: "t",
        artist: "a",
        genre: "g",
        src: "/music/1.wav",
        cover: "c.png",
        isFree: true,
      },
    ])

    renderWithChakra(<App />)

    expect(
      await screen.findByText("MEMORIAL SHOP ver1.0")
    ).toBeInTheDocument()

    // 取得関数が呼ばれたか
    expect(mockedGetTracks).toHaveBeenCalledTimes(1)
  })
})