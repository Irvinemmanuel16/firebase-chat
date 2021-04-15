import styled from 'styled-components';

export default function Modal(props) {
  return (
    <ModalContainer {...props}>
      <ModalContent onClick={e => e.stopPropagation()}>
        {props.children}
      </ModalContent>
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 500px;
  background-color: #fff;
`;
