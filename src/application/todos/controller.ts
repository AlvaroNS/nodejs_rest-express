import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";


export class TodosController {

    //* Dependency Injection
    constructor() { 

    }

    public getTodos = async(req:Request, res:Response) => {
        const todos =  await prisma.todo.findMany();
        return res.json( todos );
    }

    public getTodoById = async(req: Request, res: Response) => {
        
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'Invalid id' });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        

        ( todo )
            ? res.json( todo )
            : res.status(404).json({ error: `TODO with id:${ id } not found`})
    }

    public createTodo = async(req: Request, res: Response) => {

        // const { text } = req.body;
        const [error, createTodoDto] = CreateTodoDto.create( req.body );

        if( error ) return res.status(400).json({ error });

        
        // grabación a base de datos
        const todo = await prisma.todo.create({
            data: {
                text: createTodoDto!.text,
                completedAt: new Date()
            }
        
        })

        // const newTodo = {
        //     id: todos.length + 1,
        //     text: text,
        //     completedAt: new Date()
        // }

        // todos.push( todo );
        
        res.json( todo )

    }

    public updateTodo = async(req: Request, res: Response) => {

        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ id, ...req.body })

        if( error ) return res.status(400).json({ error });
        // if ( isNaN(id) ) return res.status(400).json({ error: 'Invalid id' });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        if ( !todo ) return res.status(404).json({ error: `TODO with id:${ id } not found`});

        // const { text, completedAt } = req.body;
        // if( !text ) return res.status(404).json({ error: `Text property is required`})

        // todo.text = text || todo.text;
        // ( completedAt === 'null' )
        //     ? todo.completedAt = null
        //     : todo.completedAt = new Date( completedAt || todo.completedAt );

        

        const updatedtodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        });
        
        res.json( updatedtodo );
    }

    public deleteTodo = async(req: Request, res: Response) => {

        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'Invalid id' });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        // const todo = todos.find( todo => todo.id === id);
        if ( !todo ) return res.status(404).json({ error: `TODO with id:${ id } not found`});

        // todos.splice( todos.indexOf(todo), 1 );

        const deletedTodo = await prisma.todo.delete({
            where: { id }
        });

        ( deletedTodo )
            ? res.json( {todo, deletedTodo} )
            : res.status(404).json({ error: `TODO with id:${ id } not found`})

    }
    
}