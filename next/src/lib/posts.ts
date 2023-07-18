export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
  
      return {
        id,
        title: matterResult.data.title,
        date: matterResult.data.date,
        description: matterResult.data.description,
        imageUrl: matterResult.data.imageUrl,
        category: matterResult.data.category,
        author: matterResult.data.author,
      };
    });
  
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  }
  