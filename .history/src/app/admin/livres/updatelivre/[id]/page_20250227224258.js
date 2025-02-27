import Updatelivre from "@/components/admin/Updatelivre";

const getspecialites = async () => {
  try {
    const response = await fetch(process.env.URL + "/api/specialites", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch specialites");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getediteurs = async () => {
  try {
    const response = await fetch(process.env.URL + "/api/editeurs", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch editeurs");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getauteurs = async () => {
  try {
    const response = await fetch(process.env.URL + "/api/auteurs", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch auteurs");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchlivre = async (livreId) => {
  if (!livreId) {
    console.error("No livreId provided!");
    return null;
  }

  try {
    const res = await fetch(`${process.env.URL}/api/livres/${livreId}`, {
      method: "GET",
    });

    if (!res.ok) {
      console.error(`Failed to fetch livre: ${res.status} ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching livre:", error);
    return null;
  }
};


const updatelivrePage = async ({ params }) => {
  const livreId = await params.id;  

  if (!livreId) {
    return <div>Error: No livre ID provided</div>;
  }

  const [specialites, editeurs, auteurs, livre] = await Promise.all([
    getspecialites(),
    getediteurs(),
    getauteurs(),
    fetchlivre(livreId),
  ]);

  if (!livre) {
    return <div>Error: Failed to load the book</div>;
  }

  return (
    <div>
      <Updatelivre livre={livre} specialites={specialites} editeurs={editeurs} auteurs={auteurs} />
    </div>
  );
};

export default updatelivrePage;
