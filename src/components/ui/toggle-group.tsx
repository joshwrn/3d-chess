import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@lib/utils'

const toggleVariants = cva('inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground', {
  variants: { variant: { default: 'bg-transparent', outline: 'border border-input bg-transparent shadow-sm' }, size: { default: 'h-9 px-3', sm: 'h-8 px-2.5', lg: 'h-10 px-5' } },
  defaultVariants: { variant: 'default', size: 'default' },
})

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({ size: 'default', variant: 'default' })
const ToggleGroup = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>>(
  ({ className, variant, size, children, ...props }, ref) => <ToggleGroupPrimitive.Root ref={ref} className={cn('inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className)} {...props}>
    <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>,
)
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName
const ToggleGroupItem = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Item>, React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>>(
  ({ className, children, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext)
    return <ToggleGroupPrimitive.Item ref={ref} className={cn(toggleVariants({ variant: variant ?? context.variant, size: size ?? context.size }), className)} {...props}>{children}</ToggleGroupPrimitive.Item>
  },
)
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem, toggleVariants }
