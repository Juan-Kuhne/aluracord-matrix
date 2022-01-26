import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaMsg, setListaMsg] = React.useState([]);

  // Usuário
  /*
  - Usuário digita no campo textarea
  - aperta enter para enviar
  - Tem que adicionar o texto na listagem
  */

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      id: listaMsg.length + 1,
      de: "vanessametonini",
      texto: novaMensagem,
    };
    setListaMsg([mensagem, ...listaMsg]);
    setMensagem("");
  }

  const apagarMensagem = (id) => {
    const novaLista = [...listaMsg].filter((value) => {
      return value.id !== id;
    });
    setListaMsg(novaLista);
  };

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          {/* //================================================================================================ */}
          <Box
            tag="ul"
            styleSheet={{
              overflow: "auto",
              display: "flex",
              flexDirection: "column-reverse",
              flex: 1,
              color: appConfig.theme.colors.neutrals["000"],
              marginBottom: "16px",
            }}
          >
            {listaMsg.map((mensagem) => {
              return (
                <Text
                  key={mensagem.id}
                  tag="li"
                  styleSheet={{
                    borderRadius: "5px",
                    padding: "6px",
                    marginBottom: "12px",
                    hover: {
                      backgroundColor: appConfig.theme.colors.neutrals[700],
                    },
                  }}
                >
                  <Box
                    styleSheet={{
                      marginBottom: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Image
                        styleSheet={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          display: "inline-block",
                          marginRight: "8px",
                        }}
                        src={`https://github.com/vanessametonini.png`}
                      />
                      <Text tag="strong">mensagem.de</Text>
                      <Text
                        styleSheet={{
                          fontSize: "10px",
                          marginLeft: "8px",
                          color: appConfig.theme.colors.neutrals[300],
                        }}
                        tag="span"
                      >
                        {new Date().toLocaleDateString()}
                      </Text>
                    </Box>

                    <Text
                      tag="span"
                      className="ex"
                      onClick={() => {
                        apagarMensagem(mensagem.id);
                      }}
                      styleSheet={{
                        fontSize: "16px",
                        marginRight: "8px",
                        color: appConfig.theme.colors.neutrals[300],
                        cursor: "pointer",
                      }}
                    >
                      ✖
                    </Text>
                  </Box>
                  {mensagem.texto}
                </Text>
              );
            })}
          </Box>
          {/* //================================================================================================ */}
          {/* <MessageList mensagens={listaMsg} /> */}
          {/* lista de mensagens:{" "}
          {listaMsg.map((mensagemAtual) => {
            return (
              <li key={mensagemAtual.id}>
                {mensagemAtual.de} : {mensagemAtual.texto}
              </li>
            );
          })} */}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                setMensagem(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              type="submit"
              label="Enviar"
              onClick={(event) => {
                event.preventDefault();
                handleNovaMensagem(mensagem);
              }}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
              styleSheet={{
                height: "83%",
              }}
            />
          </Box>
          {/* <TextField /> */}
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

// function MessageList(props) {
//   // console.log(props);

//   return (
//     <Box
//       tag="ul"
//       styleSheet={{
//         overflow: "auto",
//         display: "flex",
//         flexDirection: "column-reverse",
//         flex: 1,
//         color: appConfig.theme.colors.neutrals["000"],
//         marginBottom: "16px",
//       }}
//     >
//       {props.mensagens.map((mensagem) => {
//         return (
//           <Text
//             key={mensagem.id}
//             tag="li"
//             styleSheet={{
//               borderRadius: "5px",
//               padding: "6px",
//               marginBottom: "12px",
//               hover: {
//                 backgroundColor: appConfig.theme.colors.neutrals[700],
//               },
//             }}
//           >
//             <Box
//               styleSheet={{
//                 marginBottom: "8px",
//                 display: "flex",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Box>
//                 <Image
//                   styleSheet={{
//                     width: "20px",
//                     height: "20px",
//                     borderRadius: "50%",
//                     display: "inline-block",
//                     marginRight: "8px",
//                   }}
//                   src={`https://github.com/vanessametonini.png`}
//                 />
//                 <Text tag="strong">mensagem.de</Text>
//                 <Text
//                   styleSheet={{
//                     fontSize: "10px",
//                     marginLeft: "8px",
//                     color: appConfig.theme.colors.neutrals[300],
//                   }}
//                   tag="span"
//                 >
//                   {new Date().toLocaleDateString()}
//                 </Text>
//               </Box>

//               <Text
//                 tag="span"
//                 className="ex"
//                 // onClick={props.setMsg(mensagem.id)}
//                 styleSheet={{
//                   fontSize: "16px",
//                   marginRight: "8px",
//                   color: appConfig.theme.colors.neutrals[300],
//                   cursor: "pointer",
//                 }}
//               >
//                 ✖
//               </Text>
//             </Box>
//             {mensagem.texto}
//           </Text>
//         );
//       })}
//     </Box>
//   );
// }
