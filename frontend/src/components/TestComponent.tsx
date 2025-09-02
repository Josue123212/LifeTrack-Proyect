// Componente de prueba para verificar imports absolutos
export const TestComponent = () => {
  return (
    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center">
        <span className="mr-2">✅</span>
        TestComponent con Tailwind CSS
      </h3>
      <div className="space-y-2">
        <p className="text-blue-800">
          Este componente se importó usando paths absolutos: 
          <code className="bg-blue-100 px-2 py-1 rounded text-sm font-mono ml-1">
            @/components/TestComponent
          </code>
        </p>
        <p className="text-blue-700 text-sm flex items-center">
          <span className="mr-2">🎯</span>
          Los paths absolutos están funcionando correctamente!
        </p>
        <p className="text-blue-700 text-sm flex items-center">
          <span className="mr-2">🎨</span>
          Tailwind CSS configurado y funcionando!
        </p>
      </div>
    </div>
  );
};

export default TestComponent;