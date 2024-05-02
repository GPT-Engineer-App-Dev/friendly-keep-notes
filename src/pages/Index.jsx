import { Box, Flex, Textarea, Input, Button, useToast, SimpleGrid, Heading } from '@chakra-ui/react';
import { FaTrash, FaSave, FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { client } from '../../lib/crud';

const NoteCard = ({ note, onSave, onDelete }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        mb={2}
      />
      <Textarea
        placeholder="Take a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        mb={2}
      />
      <Button leftIcon={<FaSave />} colorScheme="blue" onClick={() => onSave(note.id, title, content)}>
        Save
      </Button>
      <Button leftIcon={<FaTrash />} colorScheme="red" onClick={() => onDelete(note.id)} ml={2}>
        Delete
      </Button>
    </Box>
  );
};

const Index = () => {
  const [notes, setNotes] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchNotes = async () => {
      const fetchedNotes = await client.getWithPrefix('note:');
      setNotes(fetchedNotes || []);
    };
    fetchNotes();
  }, []);

  const handleSave = async (id, title, content) => {
    const success = await client.set(`note:${id}`, { title, content });
    if (success) {
      setNotes(notes.map(note => note.id === id ? { ...note, title, content } : note));
      toast({
        title: 'Note saved.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    const success = await client.delete(`note:${id}`);
    if (success) {
      setNotes(notes.filter(note => note.id !== id));
      toast({
        title: 'Note deleted.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleAddNote = () => {
    const newNote = { id: Date.now(), title: '', content: '' };
    setNotes([...notes, newNote]);
  };

  return (
    <Flex direction="column" p={5}>
      <Heading mb={4}>Note Taking App</Heading>
      <Button leftIcon={<FaPlus />} colorScheme="green" onClick={handleAddNote}>
        Add Note
      </Button>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={5} mt={5}>
        {notes.map(note => (
          <NoteCard key={note.id} note={note} onSave={handleSave} onDelete={handleDelete} />
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default Index;