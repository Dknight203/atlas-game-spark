
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GenreSelectorsProps {
  primaryGenre: string;
  secondaryGenre: string;
  onSelectChange: (field: string, value: string) => void;
}

const genreOptions = [
  "Action",
  "Adventure", 
  "RPG",
  "Strategy",
  "Simulation",
  "Sports",
  "Racing",
  "Puzzle",
  "Platformer",
  "Fighting",
  "Shooter",
  "Horror",
  "Survival",
  "Sandbox",
  "MMO",
  "Card Game",
  "Educational",
  "Casual",
  "Arcade",
  "Other"
];

const GenreSelectors = ({ primaryGenre, secondaryGenre, onSelectChange }: GenreSelectorsProps) => {
  // Filter out the selected primary genre from secondary genre options
  const secondaryGenreOptions = genreOptions.filter(genre => genre !== primaryGenre);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="genre">Primary Genre *</Label>
        <Select value={primaryGenre} onValueChange={(value) => onSelectChange('genre', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select primary genre" />
          </SelectTrigger>
          <SelectContent>
            {genreOptions.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="secondary_genre">Secondary Genre</Label>
        <Select value={secondaryGenre} onValueChange={(value) => onSelectChange('secondary_genre', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select secondary genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {secondaryGenreOptions.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GenreSelectors;
