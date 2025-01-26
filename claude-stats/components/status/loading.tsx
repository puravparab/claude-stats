import Image from 'next/image';

const Loading = () => {
	return (
    <div className="flex flex-col items-center justify-center w-full">
      <Image
        src="/assets/images/claude_loading.png"
        alt="Loading..."
        width={500}
        height={500}
        priority
        className="animate-pulse"
      />
      <p className="text-gray-600 mt-4 text-lg">Crunching the numbers...</p>
    </div>
	)
};

export default Loading;