import { Modal, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";


interface Props
{
    children?: React.ReactNode;
}


export default function ErrorPage(props: Props): React.ReactNode
{
    const navigate = useNavigate();
    const title = (
        <Text c='red'>
            Error
        </Text>
    );

    return (
        <Modal opened={true} centered withCloseButton={false} onClose={close} title={title}>
            {props.children}
        </Modal>
    );


    function close()
    {
        navigate('/');
    }
}
