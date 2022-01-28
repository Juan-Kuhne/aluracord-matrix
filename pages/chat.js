import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4NTk0OSwiZXhwIjoxOTU4ODYxOTQ5fQ.4SMMDZ6fHHTLYqDPc-lFt1_KWgrWgOq8TRr8bhhS91w';
const SUPABASE_URL = 'https://gckgugoiggffvlyvxxgk.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function fetchMsgRealTime(addMsg) {
  supabaseClient
    .from('mensagens')
    .on('INSERT', res => {
      console.log('Novas mensagens');
      addMsg(res.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  console.log('roteamento.query:', roteamento.query);
  console.log('usuarioLogado:', usuarioLogado);
  const [mensagem, setMensagem] = React.useState('');
  const [listaMsg, setListaMsg] = React.useState([
    // {
    //   id: 1,
    //   de: 'omariosouto',
    //   texto:
    //     ':sticker:http://2.bp.blogspot.com/-d21tffsTIQo/U_H9QjC69gI/AAAAAAAAKqM/wnvOyUr6a_I/s1600/Pikachu%2B2.gif',
    // },
    // {
    //   id: 2,
    //   de: 'peas',
    //   texto: 'O ternário é meio triste',
    // },
  ]);

  React.useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        // console.log('Dados da consulta: ', data);
        setListaMsg(data);
      });
    fetchMsgRealTime(novaMensagem => {
      // console.log('Nova mensagem:', novaMensagem);
      setListaMsg(valorAtualDaLista => {
        return [novaMensagem, ...valorAtualDaLista];
      });
    });
  }, []);

  function handleNovaMensagem(novaMensagem) {
    // Cria mensagem a ser inserida no db
    const mensagem = {
      // id: listaMsg.length + 1,
      de: usuarioLogado,
      texto: novaMensagem,
    };

    // Cria mensagem fake para loading
    const alterList = [...listaMsg];
    alterList.unshift({
      id: -1,
      de: 'Loading',
      texto: 'Loading',
    });
    console.log(alterList);
    setListaMsg([...alterList]); //seta mensagem fake que será substituida pela real assim que o fetch retornar

    setMensagem(''); //apaga campo de digitação

    supabaseClient //altera a mensagem fake pela real
      .from('mensagens')
      .insert([mensagem])
      .then(({ data }) => {
        // console.log('Resposta insert:', data);
        // alterList.shift();
        // setListaMsg([data[0], ...alterList]);
      });
  }

  const apagarMensagem = idDel => {
    supabaseClient
      .from('mensagens')
      .delete()
      .eq('id', idDel)
      .then(res => {
        res.status === 200
          ? console.log('Mensagem apagada')
          : console.log('Erro ao apagar mensagem');
      });

    const novaLista = [...listaMsg].filter(value => {
      return value.id !== idDel;
    });
    setListaMsg(novaLista);
  };

  return (
    <>
      <Box
        className="usercard"
        styleSheet={{
          position: 'absolute',
          left: '240px',
          // top: '533px',
          display: 'none',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          color: appConfig.theme.colors.neutrals[200],
          width: '10rem',
          height: '5rem',
          zIndex: '2',
          border: `2px solid ${appConfig.theme.colors.primary[500]}`,
          borderRadius: '8px 8px 8px 0',
        }}
      >
        {/* Cartão */}
        <Text tag="p">
          User:{' '}
          <Text tag="span" className="user">
            --
          </Text>
        </Text>
        <Text tag="p">
          Followers:{' '}
          <Text tag="span" className="followers">
            --
          </Text>
        </Text>
        <Text tag="p">
          Following:{' '}
          <Text tag="span" className="following">
            --
          </Text>
        </Text>
      </Box>
      <Box
        styleSheet={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: `url(https://cdn.wallpapersafari.com/84/22/Jz6bAs.gif)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
          color: appConfig.theme.colors.neutrals['000'],
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            borderRadius: '5px',
            backgroundColor: appConfig.theme.colors.neutrals[700],
            height: '100%',
            maxWidth: '80%',
            maxHeight: '85vh',
            padding: '32px',
          }}
        >
          <Header />
          <Box
            styleSheet={{
              position: 'relative',
              display: 'flex',
              flex: 1,
              height: '80%',
              backgroundColor: appConfig.theme.colors.neutrals[600],
              flexDirection: 'column',
              borderRadius: '5px',
              padding: '16px',
            }}
          >
            {/* //================================================================================================ */}
            <Box
              tag="ul"
              styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals['000'],
                marginBottom: '16px',
              }}
            >
              {listaMsg.map(mensagem => {
                // console.log(mensagem);
                return (
                  <Text
                    key={mensagem.id}
                    tag="li"
                    styleSheet={{
                      borderRadius: '5px',
                      padding: '6px',
                      marginBottom: '12px',
                      hover: {
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                      },
                    }}
                  >
                    <Box
                      styleSheet={{
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Image
                          onMouseOver={e => {
                            // console.log(e);
                            const card = document.querySelector('.usercard');
                            e.target.style.transform = 'scale(2, 2)';
                            card.style.top = `${e.pageY - 90}px`;
                            card.style.display = 'block';
                            fetch(`https://api.github.com/users/${mensagem.de}`)
                              .then(res => {
                                return res.json();
                              })
                              .then(data => {
                                document.querySelector('.user').innerHTML =
                                  data.login;
                                document.querySelector('.followers').innerHTML =
                                  data.followers;
                                document.querySelector('.following').innerHTML =
                                  data.following;
                              });
                          }}
                          onMouseOut={e => {
                            e.target.style.transform = 'scale(1,1)';
                            document.querySelector('.usercard').style.display =
                              'none';
                            document.querySelector('.user').innerHTML = '--';
                            document.querySelector('.followers').innerHTML =
                              '--';
                            document.querySelector('.following').innerHTML =
                              '--';
                          }}
                          styleSheet={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                            marginLeft: '8px',
                            transition: 'all 0.5s ease',
                          }}
                          src={`https://github.com/${mensagem.de}.png`}
                        />
                        <Text
                          tag="strong"
                          styleSheet={{
                            marginLeft: '5px',
                          }}
                        >
                          {mensagem.de}
                        </Text>
                        <Text
                          styleSheet={{
                            fontSize: '10px',
                            marginLeft: '8px',
                            color: appConfig.theme.colors.neutrals[300],
                          }}
                          tag="span"
                        >
                          {new Date().toLocaleDateString()}
                        </Text>
                      </Box>

                      <Text
                        tag="span"
                        onClick={() => {
                          apagarMensagem(mensagem.id);
                        }}
                        styleSheet={{
                          fontSize: '16px',
                          marginRight: '8px',
                          color: appConfig.theme.colors.neutrals[300],
                          cursor: 'pointer',
                          opacity: '0.3',
                          hover: {
                            opacity: '1',
                          },
                        }}
                      >
                        ✖
                      </Text>
                    </Box>
                    {mensagem.texto.startsWith(':sticker:') ? (
                      <Image
                        src={mensagem.texto.replace(':sticker:', '')}
                        styleSheet={{
                          maxWidth: '12rem',
                        }}
                      />
                    ) : (
                      mensagem.texto
                    )}
                    {/* {mensagem.texto} */}
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
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <TextField
                value={mensagem}
                onChange={event => {
                  setMensagem(event.target.value);
                }}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleNovaMensagem(mensagem);
                  }
                }}
                placeholder="Insira sua mensagem aqui..."
                type="textarea"
                styleSheet={{
                  width: '100%',
                  border: '0',
                  resize: 'none',
                  borderRadius: '5px',
                  padding: '6px 8px',
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                  marginRight: '12px',
                  color: appConfig.theme.colors.neutrals[200],
                }}
              />
              <ButtonSendSticker
                onStickerClick={sticker => {
                  // console.log('Salva esse sticker no banco:', sticker);
                  handleNovaMensagem(`:sticker:${sticker}`);
                }}
              />
              <Button
                type="submit"
                label="Enviar"
                onClick={event => {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }}
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals['000'],
                  mainColor: appConfig.theme.colors.primary[500],
                  mainColorLight: appConfig.theme.colors.primary[400],
                  mainColorStrong: appConfig.theme.colors.primary[600],
                }}
                styleSheet={{
                  height: '83%',
                }}
              />
            </Box>
            {/* <TextField /> */}
          </Box>
        </Box>
      </Box>
    </>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: '100%',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
