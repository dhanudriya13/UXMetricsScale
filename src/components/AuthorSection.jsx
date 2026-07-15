import { User, Mail, Heart } from 'lucide-react';

const authors = [
  {
    name: "Gede Rasben Dantes",
    title: "Professor in Information System Study Program, Universitas Pendidikan Ganesha, Singaraja, Bali, Indonesia",
    email: "rasben.dantes@undiksha.ac.id",
    isCorresponding: false,
  },
  {
    name: "Putu Dhanu Driya",
    title: "Lecturer in Information System Study Program, Universitas Pendidikan Ganesha, Singaraja, Bali, Indonesia",
    email: "dhanu.driya@undiksha.ac.id",
    isCorresponding: true,
  },
  {
    name: "I Made Ardwi Pradnyana",
    title: "Asistant Professor in Information System Study Program, Universitas Pendidikan Ganesha, Singaraja, Bali, Indonesia",
    email: "ardwi.pradnyana@undiksha.ac.id",
    isCorresponding: false,
  },
  {
    name: "Putu Yudia Pratiwi",
    title: "Asistant Professor in Information System Study Program, Universitas Pendidikan Ganesha, Singaraja, Bali, Indonesia",
    email: "putuyudia.pratiwi@undiksha.ac.id",
    isCorresponding: false,
  }
];

const AuthorSection = () => {
  return (
    <div className="mt-12 mb-4 border border-border bg-surface/50 rounded-xl p-6 md:p-8 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-text">Authors</h2>
        <div className="hidden md:flex flex-col items-center justify-center pl-8 ml-4">
          <div className="text-textMuted text-xs uppercase tracking-wider font-semibold mb-2">Built with</div>
          <div className="flex gap-2 text-textMuted">
            <Heart className="w-5 h-5 text-danger" fill="currentColor" />
          </div>
          <div className="text-xs text-textMuted mt-2">React & Tailwind</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {authors.map((author, index) => (
          <div key={index} className="flex flex-col xl:flex-row items-center xl:items-start gap-4 p-4 rounded-lg bg-background border border-border transition-colors hover:border-primary/50">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center p-0.5 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                <User className="w-7 h-7 text-textMuted" />
              </div>
            </div>
            <div className="flex-1 text-center xl:text-left">
              <h3 className="text-lg font-bold text-text flex items-center justify-center xl:justify-start gap-2">
                {author.name}
              </h3>
              <p className="text-primary text-sm font-medium mt-1">{author.title}</p>
              
              <div className="mt-3 flex flex-wrap items-center justify-center xl:justify-start gap-2 text-textMuted text-sm">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${author.email}`} className="hover:text-primary transition-colors">
                  {author.email}
                </a>
                {author.isCorresponding && (
                  <span className="text-[10px] uppercase font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-1">
                    Corresponding
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorSection;
