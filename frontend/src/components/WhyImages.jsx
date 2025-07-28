import search from "../assets/search.png";
import edit from "../assets/edit.png";
import shield from "../assets/shield.png";

function WhyImages() {
  const highlights = [
    {
      img: search,
      title: "Smart Search",
      desc: "Quickly find any document, mention, or comment using our intelligent search filters.",
    },
    {
      img: edit,
      title: "Rich Editor",
      desc: "Create beautifully formatted documents with real-time collaboration and version tracking.",
    },
    {
      img: shield,
      title: "Secure Sharing",
      desc: "All your documents are protected with strong encryption and access control.",
    },
  ];

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <img
              src={item.img}
              alt={item.title}
              className="h-24 mx-auto mb-4 object-contain"
            />
            <h3 className="text-xl font-semibold text-center text-blue-800">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm mt-2 text-center">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyImages;
