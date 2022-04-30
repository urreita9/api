const { User, Caretaker, Operation, Pet } = require('../../db');

const verifyStatus = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'APPROVED';

    default:
      return 'CREATED';
  }
};

const searchOperations = async (operations, user) => {
  user === 'true'
    ? (operations = await Promise.all(
        operations.map(async (operation) => {
          const { caretakerId, petId } = operation;

          const caretaker = await User.findByPk(caretakerId);
          const pet = await Pet.findByPk(petId);

          return {
            operation,
            caretaker,
            pet,
          };
        })
      ))
    : (operations = await Promise.all(
        operations.map(async (operation) => {
          const { userId, petId } = operation;

          const user = await User.findByPk(userId);
          const pet = await Pet.findByPk(petId);

          return {
            operation,
            user,
            pet,
          };
        })
      ));

  return operations;
};

const editStatusOperation = async (operationId) => {
  try {
    const operation = await Operation.findByPk(operationId);
    
    if (!operation) return { msg: 'Operation does not exist' };

    await operation.update({ status: 'COMPLETED' });

    return true;
  } catch (error) {
    return false; 
  }
}

const editDispatchOperation = async (operationId) => {
  try {
    const operation = await Operation.findByPk(operationId);
    
    if (!operation) return { msg: 'Operation does not exist' };

    await operation.update({ status: 'COMPLETED', dispatch: true });

    return true;
  } catch (error) {
    return false; 
  }
}

module.exports ={
  verifyStatus,
  searchOperations,
  editStatusOperation,
  editDispatchOperation,
}