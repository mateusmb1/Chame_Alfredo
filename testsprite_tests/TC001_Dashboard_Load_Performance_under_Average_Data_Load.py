import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3333", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click on the 'Entrar' (login) link to go to the login page.
        frame = context.pages[-1]
        # Click on the 'Entrar' link to navigate to the login page
        elem = frame.locator('xpath=html/body/div/div/header/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input username and password, then click the login button to access the dashboard.
        frame = context.pages[-1]
        # Input username 'martes'
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/form/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('martes')
        

        frame = context.pages[-1]
        # Input password 'admin123'
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/form/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('admin123')
        

        frame = context.pages[-1]
        # Click the login button to submit credentials
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Manually measure the load time by reloading the dashboard and timing the load duration visually or by using browser tools.
        await page.goto('http://localhost:3333/dashboard', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Manually measure the dashboard load time by reloading the page and timing the load duration visually.
        await page.goto('http://localhost:3333/dashboard', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Manually measure the dashboard load time by reloading the page and timing the load duration visually or with browser tools.
        await page.goto('http://localhost:3333/dashboard', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Manually measure the dashboard load time by reloading the page and timing the load duration visually or with browser tools.
        await page.goto('http://localhost:3333/dashboard', timeout=10000)
        await asyncio.sleep(3)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Dashboard').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Serviços').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Propostas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Agenda').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Clientes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Estoque').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Chat').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ajustes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=JOÃO ALFREDO').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=ADMIN ALPHA').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=OS ATIVAS').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1000').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=12%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=0').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=LEADS HOJE').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2h 15m').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=VOLUME DE ORDENS POR DIA').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FUNIL OPERACIONAL').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PENDENTE').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=998 (100%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=EM CURSO').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2 (0%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=CONCLUÍDO').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=0 (0%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=ATRASADO').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=0 (0%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=BASE DE CLIENTES').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PJ / CONDOS').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=74').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PF / RESIDENCIAIS').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=117').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=VER CARTEIRA COMPLETA').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=ATIVIDADES RECENTES').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=HOJE').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=mateus silva • portao').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Camila Barros • Portão Automático').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=mateus mbs • portao').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=josé • Câmeras / Segurança').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=alfredo • seguranca').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=mas • Importado').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Edf Praia Dos Jardins • Importado').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=15%,85 • Importado').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    