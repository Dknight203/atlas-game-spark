
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

const SignalProfile = () => {
  const form = useForm({
    defaultValues: {
      title: "Starlight Wanderer",
      pitch: "A narrative roguelike about exploring a procedurally generated galaxy...",
      platforms: ["Steam", "itch.io", "Xbox", "Switch", "PlayStation"],
      genres: ["Roguelike", "Adventure", "Narrative", "Sci-Fi", "Exploration"]
    }
  });

  const handleSelectChange = (value: string, currentSelected: string[]) => {
    return currentSelected.includes(value)
      ? currentSelected.filter(item => item !== value)
      : [...currentSelected, value];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signal Profile Builder</CardTitle>
        <CardDescription>Create a structured profile of your game to find the perfect audience match</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="bg-gray-100 rounded-lg p-6 border border-gray-200">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Game Title</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full p-2 border rounded-md" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pitch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Short Pitch</FormLabel>
                    <FormControl>
                      <textarea 
                        {...field} 
                        className="w-full p-2 border rounded-md" 
                        rows={2}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {['Steam', 'itch.io', 'Xbox', 'Switch', 'PlayStation'].map(platform => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`platform-${platform}`} 
                          checked={form.getValues("platforms").includes(platform)}
                          onCheckedChange={() => {
                            const current = form.getValues("platforms");
                            form.setValue("platforms", handleSelectChange(platform, current));
                          }}
                        />
                        <label htmlFor={`platform-${platform}`} className="text-sm">
                          {platform}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {['Roguelike', 'Adventure', 'Narrative', 'Sci-Fi', 'Exploration'].map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`genre-${tag}`} 
                          checked={form.getValues("genres").includes(tag)}
                          onCheckedChange={() => {
                            const current = form.getValues("genres");
                            form.setValue("genres", handleSelectChange(tag, current));
                          }}
                        />
                        <label htmlFor={`genre-${tag}`} className="text-sm">
                          {tag}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button className="bg-atlas-purple ml-auto">Save Profile</Button>
      </CardFooter>
    </Card>
  );
};

export default SignalProfile;
