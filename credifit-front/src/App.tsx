import { useEffect, useState, useRef, FormEvent } from 'react'
import './styles.css'
import { SlArrowDown, SlArrowLeft } from "react-icons/sl";
import { RiUserLine } from "react-icons/ri";
import { api } from './services/api'
import { PiClockClockwiseFill } from "react-icons/pi";
import { BsChevronDown, BsChevronUp, BsCheckCircle } from "react-icons/bs";

//propriedades de EmployeeModel
interface EmployeeModel{
  id: string,
  name: string,
  cpf: string,
  email: string,
  password: string,
  salario: number,
  empresa: string,
}

//Propriedades de LoanModel
interface LoanModel{
  loanId: string,
  employeecpf: number,
  loanAmount: number,
  loanInstallments: number,
  installment: number,
  status: string,
}


export default function App(){
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeModel | null>(null);
  const [loans, setLoans] = useState<LoanModel[]>([])
  const idInputRef = useRef<HTMLInputElement | null>(null);
  const [showIdForm, setShowIdForm] = useState(true);
  const [valorEmprestimo, setValorEmprestimo] = useState(0);
  const [valorMaximo, setValorMaximo] = useState(0);
  const [screen, setScreen] = useState<'simulacao' | 'resultado' | 'solicitar' | 'emprestimos'>('simulacao');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [detailsVisible, setDetailsVisible] = useState<boolean[]>([]);


  useEffect(() => {
    async function loadLoans() {
      try {
        const response = await api.get(`/funcionario/emprestimos/${currentEmployee?.cpf}`);
        setLoans(response.data)
        setDetailsVisible(new Array(response.data.length).fill(false))
      } catch (error) {
        console.error('Erro ao carregar os funcionários:', error);
      }
    }

    if (currentEmployee) {
      loadLoans();
    }
  }, [currentEmployee]);

  useEffect(() => {
    if (currentEmployee) {
      const salario = currentEmployee.salario;
      const maximoEmprestimo = salario * 0.35; // Calcula 35% do salário como valor máximo do empréstimo
      setValorMaximo(maximoEmprestimo);
    }
  }, [currentEmployee]);


  async function moveBack(){

    setScreen('simulacao')
  }

  async function handleIdSubmit(event: FormEvent) {
    event.preventDefault();
  
    if (!idInputRef.current?.value) return;
  
    const id = idInputRef.current.value;
    console.log(id)
  
    try {
      const response = await api.get<EmployeeModel>(`/funcionario/${id}`);
      setCurrentEmployee(response.data);
      setShowIdForm(false); // Esconde o campo de ID após submeter
    } catch (error) {
      console.error('Erro ao obter informações do funcionário:', error);
    }
  }
  
  function renderEmployeeName() {
    // coloca o nome no header do site após informar o id
    if (currentEmployee) {
      return (
        <button className="px-6 flex items-center">
          <RiUserLine />
          <h1 className="px-2">{currentEmployee.name}</h1>
          <SlArrowDown size={12} />
        </button>
      );
    }
    return null;
  } 

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // define o maximo da barra de valor de emprestimo
    let novoValor = parseInt(event.target.value);
    
    // Arredonda para o múltiplo de 100 mais próximo
    novoValor = Math.round(novoValor / 100) * 100;

    //limita o circulo da barra ao valor maximo calculado
    if (novoValor > valorMaximo) {
      novoValor = valorMaximo;
    }
    setValorEmprestimo(novoValor);
  }

  async function simularEmprestimo() {
    // cria o emprestimo
    if (currentEmployee) {

        setScreen('resultado');
     
      }
    }
  
   async function handleSenguinte() {
    if (currentEmployee) {
        console.log('Empréstimo simulado com sucesso:')
        setScreen('solicitar')
        }
    }

    async function solicitarEmprestimo() {
      if (currentEmployee) {
        try {
          const response = await api.post(`/emprestimo/request/${currentEmployee.id}`, {
            loanAmount: valorEmprestimo,
            loanInstallments: selectedOption
          });
          console.log('Empréstimo solicitado com sucesso:', response.data);
          setScreen('emprestimos');
    
          // Aguarda 1 segundos antes de buscar a lista de empréstimos novamente
          setTimeout(async () => {
            try {
              const updatedLoansResponse = await api.get(`/funcionario/emprestimos/${currentEmployee.cpf}`);
              setLoans(updatedLoansResponse.data);
              setDetailsVisible(new Array(updatedLoansResponse.data.length).fill(false));
            } catch (error) {
              console.error('Erro ao atualizar a lista de empréstimos:', error);
            }
          }, 1000); // Aguarda 1 segundos
    
        } catch (error) {
          console.error('Erro ao solicitar empréstimo:', error);
        }
      }
    }

    const parcelamento = () => {
      const valor = valorEmprestimo;
      const numparcelas = selectedOption;
      if (numparcelas) {
        const parcelas = valor / numparcelas;
        return `${numparcelas}x de R$ ${parcelas.toFixed(2).replace('.', ',')}`;
      }
      return "";
    }

    const valorLoan = () => {
      const valor = valorEmprestimo;
      return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }

    const emprestimoValor = (x: number) => {
      const valor = valorEmprestimo / x
      return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }

  const handleVoltar = () => {
    // volta de tela
    setScreen('simulacao');
  };

  const handleOptionClick = (option: number) => {
    // seleciona a parcela
    setSelectedOption(option);
  }

  const toggleDetails = (index: number) => {
    setDetailsVisible((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

 
    
  

  return(
    <div className="w-full bg-customWhite min-h-screen flex-col justify-center">
      {/* header */}
      <header className="bg-customBlue py-3 px-4 text-gre">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="credito.png" alt="Credito logo" className="h-5" />
            <h1 className=" text-xl font-normal">Credito Consignado</h1>
          </div>
          <div className="px-6 flex items-center">
            {renderEmployeeName()}
          </div>
        </div>
      </header>

      <main className="my-10 w-4/12 mx-auto py-4 rounded-2xl">
        
          {showIdForm && (
            // inserir ID
            <form onSubmit={handleIdSubmit}>
              <input
                ref={idInputRef}
                type="text"
                placeholder="Insira seu ID de conta pessoal"
                className="bg-white text-customBlue outline-none w-full rounded"
              />
              <button type="submit">Submit</button>
            </form>
          )}
        

          {screen === 'simulacao' && (
            <>
              <div className='flex'>
                <button className='text-xl' onClick={moveBack}>
                  <SlArrowLeft />
                </button>
                <div className='px-3 py-4'>
                  <span className='text-customCinza3 text-sm '> Home /</span> <span className='text-sm'> Crédito Consignado </span>
                  <h1 className="text-customBlue2 text-2xl font-normal"> Crédito Consignado </h1>
                </div>               
              </div>
              
              <div className='bg-white shadow-lg mx-auto px-5 py-2 w-full rounded-2xl'>
                <h1 className='text-lg text-customBlue font-medium py-3'>Simular Empréstimo</h1>
                <div className='bg-customOrage flex rounded-2xl px-2 py-2'>
                  <img src='icon-woman.png' alt='Icon de atendente' className='h-16 px-2 py-2'/>
                  <h1 className='px-3 py-3 font-sans font-normal text-gray-800'> 
                    Você possui saldo para crédito consignado pela empresa Seguros Seguradora. 
                    Faça uma simulação! 
                    Digite quanto você precisa:
                  </h1>           
                </div>

                <div className="slider-container pt-20">
                  <input
                    type="range"
                    min={0}
                    max={valorMaximo} // Usamos o valor máximo calculado
                    step={100}
                    value={valorEmprestimo}
                    onChange={handleSliderChange}
                    className="custom-slider"
                  />
                  <span className="bg-customCinza slider-value rounded-xl text-2xl py-1  px-2 text-customBlue font-semibold">R$ {valorEmprestimo.toLocaleString('pt-BR')}
                    </span>
                </div>
              </div>       
              <div className="flex justify-end mt-4">
                <button className="bg-white text-customBlue border-2 border-customBlue rounded-3xl px-16 py-3 font-medium text-base" onClick={() => moveBack()}>Voltar</button>
                <div className='pl-4'>
                  <button className="bg-customBlue text-white rounded-3xl px-5 py-3 text-base font-medium" onClick={simularEmprestimo}>Simular empréstimo</button>
                </div>          
              </div>
            </>
            
          
          )}
          
        

          {screen === 'resultado' && (
            <div>
              <div className='flex'>
                <button className='text-xl' onClick={moveBack}>
                  <SlArrowLeft />
                </button>
                <div className='px-3 py-4'>
                  <span className='text-customCinza3 text-sm '> Home /</span> <span className='text-sm'> Crédito Consignado </span>
                  <h1 className="text-customBlue2 text-2xl font-normal"> Crédito Consignado </h1>
                </div>               
              </div>
              <div className='bg-white shadow-lg mx-auto px-5 py-2 w-full rounded-2xl'>
                <h1 className='text-lg text-customBlue font-medium py-3'>Simular Empréstimo</h1>
                <div className='bg-customOrage flex rounded-2xl px-2 py-2'>
                  <img src='icon-woman.png' alt='Icon de atendente' className='h-16 px-2 py-2' />
                  <h1 className='px-3 py-3 font-sans font-normal text-gray-800'>
                    Escolha a opção de parcelamento que melhor funcionar para você:
                  </h1>
                </div>
                {/* opções de parcelamento */}
                <div className="">
                <h1 className="bg-white rounded-xl text-2xl py-5 items-center justify-center  pl-48 px-2 text-customBlue3 text font-semibold">{valorLoan()}</h1>
                  <div className="grid grid-cols-2 gap-4 mt-4 pb-24">
                    <button
                    onClick={() => handleOptionClick(1)}
                    className={`bg-customWhite border-l-8 hover:bg-orange-200 hover:duration-300 group active:bg-orange-300 border-orange-600  py-4 shadow-lg flex items-center rounded-lg px-4 text-center ${selectedOption === 1 ? 'bg-orange-200' : 'bg-customWhite'}`} 
                    >               
                      <p className={`text-gray-600 group-hover:text-black text-xl  ${selectedOption === 1 ?   'text-black':'text-grey-600'}`}>
                        <span className="align-bottom">1x de</span>
                      </p>
                      <p className={`text-customBlue px-2 group-hover:text-customBlue3 font-semibold text-2xl ${selectedOption === 1 ?   'text-customBlue3':'text-customBlue'}`}>
                        <span className="align-bottom">{valorLoan()}</span>
                      </p>
                    </button>
                    <button 
                    onClick={() => handleOptionClick(2)}
                    className={`bg-customWhite border-l-8 hover:bg-orange-200 hover:duration-300 group active:bg-orange-300 border-orange-600  py-4 shadow-lg flex items-center rounded-lg px-4 text-center ${selectedOption === 2 ? 'bg-orange-200' : 'bg-customWhite'}`} 
                    >
                      <p className={`text-gray-600 group-hover:text-black text-xl  ${selectedOption === 2 ?   'text-black':'text-grey-600'}`}> 
                        <span className="align-bottom">2x de</span>
                      </p>
                      <p className={`text-customBlue px-2 group-hover:text-customBlue3 font-semibold text-2xl ${selectedOption === 2 ?   'text-customBlue3':'text-customBlue'}`}> 
                        <span className="align-bottom">{emprestimoValor(2)}</span>
                      </p>
                    </button>
                    <button 
                    onClick={() => handleOptionClick(3)}
                    className={`bg-customWhite border-l-8 hover:bg-orange-200 hover:duration-300 group active:bg-orange-300 border-orange-600  py-4 shadow-lg flex items-center rounded-lg px-4 text-center ${selectedOption === 3 ? 'bg-orange-200' : 'bg-customWhite'}`} 
                    >
                      <p className={`text-gray-600 group-hover:text-black text-xl  ${selectedOption === 3 ?   'text-black':'text-grey-600'}`}>
                        <span className="align-bottom">3x de</span>
                      </p>
                      <p className={`text-customBlue px-2 group-hover:text-customBlue3 font-semibold text-2xl ${selectedOption === 3 ?   'text-customBlue3':'text-customBlue'}`}>
                        <span className="align-bottom">{emprestimoValor(3)}</span>
                      </p>
                    </button>
                    <button
                    onClick={() => handleOptionClick(4)}
                    className={`bg-customWhite border-l-8 hover:bg-orange-200 hover:duration-300 group active:bg-orange-300 border-orange-600  py-4 shadow-lg flex items-center rounded-lg px-4 text-center ${selectedOption === 4 ? 'bg-orange-200' : 'bg-customWhite'}`} 
                    >
                      <p className={`text-gray-600 group-hover:text-black text-xl  ${selectedOption === 4 ?   'text-black':'text-grey-600'}`}> 
                        <span className="align-bottom">4x de</span>
                      </p>
                      <p className={`text-customBlue px-2 group-hover:text-customBlue3 font-semibold text-2xl ${selectedOption === 4 ?   'text-customBlue3':'text-customBlue'}`}>
                        <span className="align-bottom">{emprestimoValor(4)}</span>
                      </p>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button className="bg-white text-customBlue border-2 border-customBlue rounded-3xl px-16 py-3 font-medium text-base" onClick={handleVoltar}>Voltar</button>
                <div className='pl-4'>
                  <button
                  disabled={!selectedOption}
                  className={`bg-customBlue text-white rounded-3xl px-5 py-3 text-base font-medium ${selectedOption ? 'bg-customBlue text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  onClick={handleSenguinte}
                  >Seguinte</button>
                </div>
              </div>
            </div>        
          )}

          {screen === 'solicitar' && (
            <>
              <div className='flex'>
                <button className='text-xl' onClick={moveBack}>
                  <SlArrowLeft />
                </button>
                <div className='px-3 py-4'>
                  <span className='text-customCinza3 text-sm '> Home /</span> <span className='text-sm'> Crédito Consignado </span>
                  <h1 className="text-customBlue2 text-2xl font-normal"> Crédito Consignado </h1>
                </div>               
              </div>
              <div className='bg-white shadow-lg mx-auto px-5 py-2 w-full rounded-2xl'>
                <h1 className='text-lg text-customBlue font-medium py-3'>Resumo da simulação</h1>
                <div className='bg-customOrage flex rounded-2xl px-2 py-2'>
                  <img src='icon-woman.png' alt='Icon de atendente' className='h-16 px-2 py-2'/>
                  <h1 className='px-3 py-3 font-sans font-normal text-gray-800'> 
                  Pronto! Agora você já pode solicitar o empréstimo e recebê-lo na sua Conta!
                   Veja o resumo da simulação!
                  </h1>           
                </div>
                <div className='grid grid-cols-2 gap-4 mt-4 pb-24 items-center'>
                  <div className='pl-7'> 
                    <p className='font-semibold text-lg '> Valor a Creditar</p>
                    <p className='text-gray-700 text-lg py-1'> {valorLoan()}</p>
                  </div>
                  <div className='pl-7'> 
                    <p className='font-semibold text-lg '> Valor a Financiar</p>
                    <p className='text-gray-700 text-lg py-1'> {valorLoan()}</p>
                  </div>
                  <div className='pl-7'> 
                    <p className='font-semibold text-lg '> Parcelamento </p>
                    <p className='text-gray-700 text-lg py-1'> {parcelamento()}</p>
                  </div>
                </div>
              </div>       
              <div className="flex justify-end mt-4">
                <button className="bg-white text-customBlue border-2 border-customBlue rounded-3xl px-16 py-3 font-medium text-base" onClick={() => moveBack()}>Voltar</button>
                <div className='pl-4'>
                  <button className="bg-customBlue text-white rounded-3xl px-5 py-3 text-base font-medium" onClick={solicitarEmprestimo}>Solicitar empréstimo</button>
                </div>          
              </div>
            </>
          )}

          {screen === 'emprestimos' && (
            <>
              <div className='flex'>
                <button className='text-xl' onClick={moveBack}>
                  <SlArrowLeft />
                </button>
                <div className='px-3 py-4'>
                  <span className='text-customCinza3 text-sm '> Home /</span> <span className='text-sm'> Crédito Consignado </span>
                  <h1 className="text-customBlue2 text-2xl font-normal"> Crédito Consignado </h1>
                </div>               
              </div>
              <div className='bg-white shadow-lg mx-auto px-5 py-5 w-full rounded-2xl'>
                <div className='pb-5'>
                  <div className='bg-customOrage flex rounded-2xl px-2 py-2'>
                    <img src='icon-woman.png' alt='Icon de atendente' className='h-16 px-2 py-2'/>
                    <h1 className='px-3 py-3 font-sans font-normal text-gray-800'> 
                    Você solicitou seu empréstimo! Agora aguarde as etapas de análises serem concluídas!
                    </h1>           
                  </div>
                </div>
                

                
                  {loans.map( (loan, x ) => (
                    <div className='bg-customWhite py-6 rounded-lg p-4 mb-4'>
                      <div className="flex justify-between items-center">
                        {loan.status === 'Rejeitado' && (
                          <div className="flex items-center">
                          <PiClockClockwiseFill className="w-6 h-6 text-customClock mr-2" />
                          <span className="text-xl font-semibold px-3">{`SOLICITAÇÃO DE EMPRÉSTIMO ${x + 1}`}</span>
                          </div>
                        )}

                        {loan.status === 'Aprovado' && (
                          <div className="flex items-center">
                            <BsCheckCircle className="w-6 h-6 text-customBlue3 mr-2" />
                            <span className="text-xl font-semibold px-3">{`EMPRESTIMO CORRENTE  ${x + 1}`}</span>
                          </div>
                        )}
                        
                        <button className='text-3xl' onClick={() => toggleDetails(x)}>
                          {detailsVisible[x] ? <BsChevronUp /> : <BsChevronDown />}
                        </button>
                      </div>
                  
                      {detailsVisible[x] && (
                        <div className="mt-4">
                          <hr className='pb-5'></hr>
                          <article key={loan.loanId}>

                            {loan.status === 'Rejeitado' && (
                              <div className=" text-customClock bg-CustomClockopacity16 px-2 w-5/12 rounded-xl py-2  font-semibold flex mb-2">
                                <PiClockClockwiseFill className="w-6 h-6 text-customClock mr-2" />
                                <p className='font-bold'> Reprovado por score </p>
                              </div>
                            )}

                            {loan.status === 'Aprovado' && (
                              <div className="text-customBluedark bg-customGreenOpacity16 px-2 w-5/12 rounded-xl py-2 bg-customBlue font-semibold flex mb-2">
                                <BsCheckCircle className="w-6 h-6 text-customBlue3 mr-2" />
                                <p className='font-bold'> Crédito aprovado </p>
                              </div>
                            )}
                            
                            <div className='grid grid-cols-2 gap-4 mt-4 pb-2 px-3  items-center'> 
                              <div>
                                <p className='font-semibold'> Empresa: </p> 
                                <p className='text-customCinza3'> {currentEmployee?.empresa} </p>
                              </div>
                              <div>
                                <p className='font-semibold'>Próximo Vencimento: </p> 
                                <p className='text-customCinza3'> 21/06/2024 </p>
                              </div>
                              {loan.status === 'Aprovado' && (
                              <div>
                                <p className='font-semibold'>Total Financiado: </p> 
                                <p className='text-customCinza3'> <span className='text-customCinza3'> R$ </span> {loan.loanAmount} </p>
                              </div>
                                  )}
                              <div>
                                <p className='font-semibold'> Valor da parcela:</p> 
                                <p className='text-customCinza3'> <span className='text-customCinza3'> R$ </span> {loan.installment} </p>
                              </div>
                              <div>
                                <p className='font-semibold'> Número de parcelas:</p> 
                                <p className='text-customCinza3'> {loan.loanInstallments} <span className='text-customCinza3'> x </span></p>
                              </div>
                            </div>   
                          </article>
                                        
                        </div>
                      )}
                    </div>
                  ))}           
              </div>       
              <div className="flex justify-end mt-4">
                <button className="bg-white text-customBlue border-2 border-customBlue rounded-3xl px-16 py-3 font-medium text-base" onClick={() => moveBack()}>Voltar</button>
                <div className='pl-4'>
                  <button className="bg-customBlue text-white rounded-3xl px-5 py-3 text-base font-medium" onClick={handleVoltar}>Novo empréstimo</button>
                </div>          
              </div>           
            </>
          )}
      </main>      
    </div>
  )
}


