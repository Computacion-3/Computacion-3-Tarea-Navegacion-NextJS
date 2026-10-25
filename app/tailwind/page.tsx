export default function Tailwind() {
    return (
        <main className="p-4">
            <button className="p-4 rounded-xl bg-blue-500 text-white font-semibold cursor-pointer border-2 border-gray-500 m-4">
                Guardar
            </button>
            <div className="flex gap-6 bg-green-200 w-1/2">
                <div className="rounded-full w-4 h-4 bg-yellow-300"></div>
                <div className="rounded-full w-4 h-4 bg-blue-300"></div>
                <div className="rounded-full w-4 h-4 bg-red-300"></div>
            </div>
            <p className="text-xl font-light truncate">Soy un texto :) Soy un texto :)Soy un texto :)Soy un texto :)Soy un texto :)Soy un texto :)Soy un texto :)Soy un texto :)</p>
            <div className="rounded-full size-24 bg-red-600/50 m-auto bg-linear-to-r from-blue-500 to-purple-500"></div>
            <div className="w-24 h-16 bg-amber-300 m-auto border rounded-lg shadow-md ring-2"></div>
            <div className="grid grid-cols-3 gap-4 w-64">
                <div className="w-full h-16 bg-blue-500 flex justify-center items-center text-white rounded-lg col-span-full">1</div>
                <div className="w-full h-16 bg-blue-500 flex justify-center items-center text-white rounded-lg">2</div>
                <div className="w-full h-16 bg-blue-500 flex justify-center items-center text-white rounded-lg">3</div>
                <div className="w-full h-16 bg-blue-500 flex justify-center items-center text-white rounded-lg">4</div>
                <div className="w-full h-16 bg-blue-500 flex justify-center items-center text-white rounded-lg">5</div>
                <div className="w-full h-16 bg-blue-500 flex justify-center items-center text-white rounded-lg">6</div>
            </div>

            <div className="bg-gray-200 ring-2 h-24 rounded-2xl ring-gray-600 mt-4 flex items-center p-4 relative">
                <p className="font-bold text-gray-600">relative (padre)</p>
                <div className="inset-x-0 bottom-0 absolute bg-gray-700 rounded-b-2xl text-white font-semibold flex justify-center">inset-x-0 bottom-0</div>
            </div>

            <div className="font-bold text-gray-600 bg-white hover:scale-105 hover:shadow-lg w-24 mt-4 flex justify-center items-center ring-2 ring-gray-300 rounded-xl transition cursor-grab animate-bounce">
                Tarjeta
            </div>
        </main>
    )
}