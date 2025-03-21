export default function Note() {
    return (
        <div>
            <form>
                <p>入力：
                    <input type="text" name="name"></input>
                </p>
            </form>
            <p><button type="button" id="button1" className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-500 hover:text-white active:bg-gray-700 active:border-blue-700 transition-colors duration-200 focus:outline-none">
                送信
            </button>
            </p>
        </div>
    )
}