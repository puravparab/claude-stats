import Image from 'next/image'

const ErrorComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Image
        src="/assets/images/claude_frustrated.png"
        alt="Error"
        width={500}
        height={500}
        priority
      />
      <p className="text-gray-600 mt-4 text-lg">Something went wrong.</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-[--primary-color] text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  )
}

export default ErrorComponent;