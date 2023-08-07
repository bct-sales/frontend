import { Box, Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function RegisterPage()
{
    const form = useForm({
        initialValues: { emailAddress: '', password: '' }
    });

    return (
        <Box maw={320} mx="auto">
            <form onSubmit={form.onSubmit(values => console.log(values))}>
                <TextInput label="Email Address" placeholder="Email Address" {...form.getInputProps('emailAddress')} />
                <PasswordInput label="Password" placeholder="Password" {...form.getInputProps('password')} />

                <Group position="right" mt="md">
                    <Button type="submit">Register</Button>
                </Group>
            </form>
        </Box>
    );
}
